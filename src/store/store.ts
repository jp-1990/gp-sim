import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import liverySlice from './livery/slice';
import carSlice from './car/slice';
import { CarsDataType, LiveriesDataType, LiveryDataType } from '../types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
  }),
  endpoints: (builder) => ({
    getCars: builder.query<CarsDataType, void>({
      query: () => ({
        url: '/cars',
        method: 'GET'
      })
    }),
    getLiveries: builder.query<LiveriesDataType, void>({
      query: () => ({
        url: '/liveries',
        method: 'GET'
      })
    }),
    getLiveryById: builder.query<LiveryDataType, string>({
      query: (id) => ({
        url: `/liveries/${id}`,
        method: 'GET'
      })
    })
  })
});
export const { useGetCarsQuery, useGetLiveriesQuery, useGetLiveryByIdQuery } =
  apiSlice;

export const storeConfig = {
  reducer: {
    [liverySlice.name]: liverySlice.reducer,
    [carSlice.name]: carSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  }
};
const store = configureStore({
  ...storeConfig,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
