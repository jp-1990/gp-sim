import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { USER_SLICE_NAME } from './constants';
import { UserDataType } from '../../types';

// CURRENT USER SLICE
const initialState: UserDataType = {
  id: '',
  createdAt: 0,
  updatedAt: 0,
  lastLogin: 0,
  forename: '',
  surname: '',
  displayName: '',
  email: '',
  about: undefined,
  image: undefined,
  garages: [],
  liveries: []
};

const userSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserDataType>) => {
      state = action.payload;
    },
    removeCurrentUser: (state, action: PayloadAction<{ id: string }>) => {
      if (state.id === action.payload.id) state = initialState;
    }
  }
});

export const { setCurrentUser, removeCurrentUser } = userSlice.actions;
export default userSlice;
