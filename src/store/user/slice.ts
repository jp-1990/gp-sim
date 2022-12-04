import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Router from 'next/router';

import {
  ALLOWED_RESET_PASSWORD_ERRORS,
  CURRENT_USER_SLICE_NAME,
  USERS_API_ROUTE
} from './constants';
import {
  CreateUserProfileDataType,
  RequestStatus,
  UserDataType
} from '../../types';
import { auth, signInWithEmailAndPassword } from '../../utils/firebase/client';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
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
  async (
    { email, password }: { email: string; password: string },
    { dispatch }
  ) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const token = await user.getIdToken();
    dispatch(getCurrentUser(token));

    Router.back();
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

const resetPassword = createAsyncThunk(
  `${CURRENT_USER_SLICE_NAME}/resetPassword`,
  async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }
);

const getCurrentUser = createAsyncThunk(
  `${CURRENT_USER_SLICE_NAME}/setCurrentUser`,
  async (token: string) => {
    const { data } = await axios.get<UserDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${USERS_API_ROUTE}/current`,
      {
        headers: {
          authorization: token
        }
      }
    );

    return { data, token };
  }
);

const userSlice = createSlice({
  name: CURRENT_USER_SLICE_NAME,
  initialState,
  reducers: {
    resetStatus(state) {
      state.error = null;
      state.status = RequestStatus.IDLE;
    },
    updateToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    updateLiveries(state, action: PayloadAction<string[]>) {
      const newState = state;
      for (const livery of action.payload) newState.data?.liveries.push(livery);
      return newState;
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
      .addCase(signIn.rejected, (state, action) => {
        state.data = null;
        state.token = null;
        state.error = action.error.message ?? null;
        state.status = RequestStatus.REJECTED;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.token = action.payload.token;
        state.error = null;
        state.status = RequestStatus.FULFILLED;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.data = null;
        state.token = null;
        state.error = action.error.message ?? null;
        state.status = RequestStatus.REJECTED;
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
      .addCase(signUp.rejected, (state, action) => {
        state.data = null;
        state.token = null;
        state.error = action.error.message ?? null;
        state.status = RequestStatus.REJECTED;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.token = action.payload.token;
        state.error = null;
        state.status = RequestStatus.FULFILLED;
      })
      .addCase(resetPassword.pending, (state) => {
        state.error = null;
        state.status = RequestStatus.PENDING;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        if (
          action.error.code &&
          !ALLOWED_RESET_PASSWORD_ERRORS.includes(action.error.code)
        ) {
          state.data = null;
          state.token = null;
          state.error = action.error.message ?? null;
          state.status = RequestStatus.REJECTED;
        } else {
          state.status = RequestStatus.IDLE;
        }
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.data = null;
        state.token = null;
        state.error = null;
        state.status = RequestStatus.FULFILLED;
      });
  }
});

export const { resetStatus, updateToken, updateLiveries } = userSlice.actions;
export { getCurrentUser, signIn, signOut, signUp, resetPassword };
export default userSlice;
