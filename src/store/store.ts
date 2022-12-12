import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';

import { default as carSlice } from './car/slice';
import { CAR_SLICE_NAME } from './car/constants';
import { GARAGE_SLICE_NAME } from './garage/constants';
import { default as garageSlice } from './garage/slice';
import { GET_LIVERIES, LIVERY_SCROLL_SLICE_NAME } from './livery/constants';
import { default as liveryScrollSlice } from './livery/scroll-slice';
import { USER_SLICE_NAME, GET_USERS } from './user/constants';
import { default as currentUserSlice } from './user/slice';

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message
        }
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL ?? ''
  }),
  extractRehydrationInfo: (action, { reducerPath }) => {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: [GET_LIVERIES, GET_USERS],
  endpoints: () => ({} as { getLiveries?: any })
});

export const storeConfig = {
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [CAR_SLICE_NAME]: carSlice.reducer,
    [USER_SLICE_NAME]: currentUserSlice.reducer,
    [GARAGE_SLICE_NAME]: garageSlice.reducer,
    [LIVERY_SCROLL_SLICE_NAME]: liveryScrollSlice.reducer
  }
};
const makeStore = () =>
  configureStore({
    ...storeConfig,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware)
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
