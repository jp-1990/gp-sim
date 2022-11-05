import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { GET_GARAGES, GET_GARAGE_BY_ID } from './garage/constants';
import { GET_LIVERIES } from './livery/constants';
import { CURRENT_USER_SLICE_NAME, GET_USERS } from './user/constants';
import { default as currentUserSlice } from './user/slice';
import { LIVERY_PAGE_SLICE_NAME } from './pages/constants';
import liveriesPageSlice from './pages/liveries-page-slice';

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
  tagTypes: [GET_LIVERIES, GET_GARAGES, GET_GARAGE_BY_ID, GET_USERS],
  endpoints: () => ({} as { getLiveries?: any })
});

export const storeConfig = {
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [CURRENT_USER_SLICE_NAME]: currentUserSlice.reducer,
    [LIVERY_PAGE_SLICE_NAME]: liveriesPageSlice.reducer
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
