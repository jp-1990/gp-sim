import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import liverySlice from './livery/slice';
import carSlice from './car/slice';

export const storeConfig = {
  reducer: {
    [liverySlice.name]: liverySlice.reducer,
    [carSlice.name]: carSlice.reducer
  }
};
const store = configureStore(storeConfig);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
