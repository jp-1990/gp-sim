import axios from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CURRENT_USER_SLICE_NAME } from './constants';
import { UserDataType } from '../../types';
import { auth, signInWithEmailAndPassword } from '../../utils/firebase/client';

// CURRENT USER SLICE
enum ThunkStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'
}

const initialState = {
  token: null as string | null,
  data: null as UserDataType | null,
  status: 'idle' as ThunkStatus
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
    const { data } = await axios.post<UserDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/current`,
      {
        headers: {
          Authorization: token
        }
      }
    );

    return { data, token };
  }
);

const signOut = createAsyncThunk(
  `${CURRENT_USER_SLICE_NAME}/signOut`,
  async () => {
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
        state.status = ThunkStatus.PENDING;
      })
      .addCase(signIn.rejected, (state) => {
        state.data = null;
        state.token = null;
        state.status = ThunkStatus.REJECTED;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.token = action.payload.token;
        state.status = ThunkStatus.FULFILLED;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.data = null;
        state.token = null;
        state.status = ThunkStatus.FULFILLED;
      });
  }
});

export const { updateToken } = userSlice.actions;
export { signIn, signOut };
export default userSlice;
