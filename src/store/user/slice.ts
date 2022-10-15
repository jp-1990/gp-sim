import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Router from 'next/router';

import { CURRENT_USER_SLICE_NAME } from './constants';
import { CreateUserProfileDataType, UserDataType } from '../../types';
import { auth, signInWithEmailAndPassword } from '../../utils/firebase/client';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// CURRENT USER SLICE
export enum ThunkStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'
}

const initialState = {
  token: null as string | null,
  data: null as UserDataType | null,
  status: 'idle' as ThunkStatus,
  error: null as string | null
};

const signIn = createAsyncThunk(
  `${CURRENT_USER_SLICE_NAME}/signIn`,
  async ({ email, password }: { email: string; password: string }) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;

    // use token from sign in to get current user data
    const token = await user.getIdToken();
    const { data } = await axios.get<UserDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/current`,
      {
        headers: {
          authorization: token
        },
        params: {
          id: user.uid
        }
      }
    );

    Router.push('/');
    return { data, token };
  }
);

const signUp = createAsyncThunk(
  `${CURRENT_USER_SLICE_NAME}/signUp`,
  async (userDetails_: CreateUserProfileDataType & { password: string }) => {
    const { password, ...userDetails } = userDetails_;
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userDetails.email,
      password
    );
    const { user } = userCredential;

    // use token from sign in to create user doc
    const token = await user.getIdToken();
    const { data } = await axios.post<UserDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users`,
      {
        headers: {
          authorization: token
        },
        params: {
          id: user.uid
        },
        data: userDetails
      }
    );

    Router.push('/');
    return { data, token };
  }
);

const signOut = createAsyncThunk(
  `${CURRENT_USER_SLICE_NAME}/signOut`,
  async () => {
    await Router.push('/');
    await auth.signOut();
  }
);

const userSlice = createSlice({
  name: CURRENT_USER_SLICE_NAME,
  initialState,
  reducers: {
    updateToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.data = null;
        state.token = null;
        state.error = null;
        state.status = ThunkStatus.PENDING;
      })
      .addCase(signIn.rejected, (state, payload) => {
        state.data = null;
        state.token = null;
        state.error = payload.error.message ?? null;
        state.status = ThunkStatus.REJECTED;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.token = action.payload.token;
        state.error = null;
        state.status = ThunkStatus.FULFILLED;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.data = null;
        state.token = null;
        state.error = null;
        state.status = ThunkStatus.FULFILLED;
      })
      .addCase(signUp.pending, (state) => {
        state.data = null;
        state.token = null;
        state.error = null;
        state.status = ThunkStatus.PENDING;
      })
      .addCase(signUp.rejected, (state, payload) => {
        state.data = null;
        state.token = null;
        state.error = payload.error.message ?? null;
        state.status = ThunkStatus.REJECTED;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.token = action.payload.token;
        state.error = null;
        state.status = ThunkStatus.FULFILLED;
      });
  }
});

export const { updateToken } = userSlice.actions;
export { signIn, signOut, signUp };
export default userSlice;
