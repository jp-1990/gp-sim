import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import { default as carSlice } from './car/slice';
import { CAR_SLICE_NAME } from './car/constants';
import { default as garageSlice } from './garage/slice';
import { GARAGE_SLICE_NAME } from './garage/constants';
import { default as liverySlice } from './livery/slice';
import { LIVERY_SLICE_NAME } from './livery/constants';
import { default as currentUserSlice } from './user/slice';
import { USER_SLICE_NAME } from './user/constants';

export const storeConfig = {
  reducer: {
    [CAR_SLICE_NAME]: carSlice.reducer,
    [USER_SLICE_NAME]: currentUserSlice.reducer,
    [GARAGE_SLICE_NAME]: garageSlice.reducer,
    [LIVERY_SLICE_NAME]: liverySlice.reducer
  }
};
const makeStore = () =>
  configureStore({
    ...storeConfig
  });
const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;

export const wrapper = createWrapper<AppStore>(makeStore);
