import axios from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CURRENT_USER_SLICE_NAME } from './constants';
import { UserDataType } from '../../types';
import { auth, signInWithEmailAndPassword } from '../../utils/firebase/client';

// CURRENT USER SLICE
// dev initial state
// const initialState: UserDataType = {
//   id: '0',
//   createdAt: 1651734649483,
//   updatedAt: 1651734649483,
//   lastLogin: 1651734649484,
//   forename: 'Julius',
//   surname: 'Little',
//   displayName: 'Julius Little',
//   email: 'julius.little@gmail.com',
//   about:
//     'Hi, I am Julius Little, and this is my profile! <br/> <br/>\n              Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n              Mauris mauris eros, euismod ut mi vitae, convallis iaculis\n              quam. Pellentesque consectetur iaculis tortor vitae euismod.\n              Integer malesuada congue elementum. Pellentesque vulputate\n              diam dignissim elit hendrerit iaculis.',
//   image: '/car2.png',
//   garages: [
//     '431d885d-4041-4518-bc92-60e69a5d5a94',
//     '9a8fbcae-06ff-428b-9008-548bae2cd134',
//     'fdceaf93-597e-4452-83dc-a2326037b0ca',
//     'be9c553b-e767-4463-b3d2-5571e89b33dd',
//     '61034479-6d77-492f-bf5c-d8812b27471e',
//     '6285e1a1-08c3-4982-be2b-06db7a2226d4',
//     '7e7f00a5-4ca2-4bb7-885e-e33bb27c404e',
//     '10fe7a00-bae2-4579-9f6e-698b906f6057',
//     '6ce8c60e-57fb-4f5b-9bf6-7ddd69696756',
//     'd7d206d0-609c-4fce-b499-ba62a8c4772e',
//     '2d2e08d9-643b-4bc6-8da7-fc28c151e1f8',
//     'ad348f42-c6a9-4cd2-a635-c9ed5f40ba01',
//     'ec08072f-156c-46a9-9691-c263e9d8e5b6',
//     '055531b5-e1ef-408c-bfb4-9ec5353812cd',
//     '8d75e2dc-ad75-4bbe-9106-5b6b20be9973',
//     '44702405-8231-43ec-9409-b28994c74fad',
//     '995feaaa-06d5-40a5-85dc-45e052979e42',
//     '450721a5-4892-4a89-be0d-8a153864ac7d',
//     'c78144b7-3bd8-4fab-bc04-e887748f389d',
//     '37517afc-70c4-416d-8f10-3473938e9221'
//   ],
//   liveries: [
//     'd03bfb4f-3b88-41ec-92bb-14b3438696ec',
//     '46b7b672-2ce1-47b2-a0ce-a66acad40ae2',
//     'b936f9e3-95aa-4562-8066-f7ca29717602',
//     'e129b18d-e008-495d-9fd4-346eb18e60e5',
//     'd63cf4fd-9d7a-4d54-9eec-b583ef69c08d',
//     '91b41272-0b4e-401b-9f11-f4d101ebf320',
//     '7657534b-80c2-430d-a808-d40c03fd6cbe',
//     '29c904a1-8d87-4ac0-b0f4-791554dabcdd',
//     'b36bb559-9ea8-44e7-b263-5be5d234bf9f'
//   ]
// };
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
