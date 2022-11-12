import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Router from 'next/router';

import { CURRENT_USER_SLICE_NAME, USERS_API_ROUTE } from './constants';
import {
  CreateUserProfileDataType,
  RequestStatus,
  UserDataType
} from '../../types';
import { auth, signInWithEmailAndPassword } from '../../utils/firebase/client';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';

// CURRENT USER SLICE
const initialState = {
  token: null as string | null,
  data: null as UserDataType | null,
  status: 'idle' as RequestStatus,
  error: null as string | null
};
export type CurrentUserType = typeof initialState;

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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${USERS_API_ROUTE}/current`,
      {
        headers: {
          authorization: token
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${USERS_API_ROUTE}`,
      {
        data: userDetails
      },
      {
        headers: {
          authorization: token
        }
      }
    );

    await sendEmailVerification(user);
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
        state.status = RequestStatus.PENDING;
      })
      .addCase(signIn.rejected, (state, payload) => {
        state.data = null;
        state.token = null;
        state.error = payload.error.message ?? null;
        state.status = RequestStatus.REJECTED;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.token = action.payload.token;
        state.error = null;
        state.status = RequestStatus.FULFILLED;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.data = null;
        state.token = null;
        state.error = null;
        state.status = RequestStatus.FULFILLED;
      })
      .addCase(signUp.pending, (state) => {
        state.data = null;
        state.token = null;
        state.error = null;
        state.status = RequestStatus.PENDING;
      })
      .addCase(signUp.rejected, (state, payload) => {
        state.data = null;
        state.token = null;
        state.error = payload.error.message ?? null;
        state.status = RequestStatus.REJECTED;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.token = action.payload.token;
        state.error = null;
        state.status = RequestStatus.FULFILLED;
      });
  }
});

export const { updateToken } = userSlice.actions;
export { signIn, signOut, signUp };
export default userSlice;
