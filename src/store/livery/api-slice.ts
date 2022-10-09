import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';

import {
  LiveryDataType,
  CreateLiveryDataType,
  LiveriesResponseType,
  LiveriesFilters
} from '../../types';
import { apiSlice } from '../store';
import {
  GET_LIVERIES,
  GET_LIVERY_BY_ID,
  CREATE_LIVERY,
  DELETE_LIVERY
} from './constants';

// ADAPTER

const liveriesAdapter = createEntityAdapter<LiveryDataType>();
const initialState = liveriesAdapter.getInitialState({
  maxPrice: null as null | number,
  perPage: null as null | number,
  page: null as null | number,
  total: null as null | number
});
export type LiverySliceStateType = typeof initialState;

// API SLICE

export const liveryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    [GET_LIVERIES]: builder.query<
      LiverySliceStateType,
      Partial<Record<keyof LiveriesFilters, string | number>>
    >({
      query: (filters) => ({
        url: '/api/v1/liveries',
        method: 'GET',
        params: filters
      }),
      transformResponse: (data: LiveriesResponseType) => {
        return {
          ...liveriesAdapter.setAll(initialState, data.liveries),
          maxPrice: data.maxPrice,
          perPage: data.perPage,
          page: data.page,
          total: data.total
        };
      },
      keepUnusedDataFor: 300,
      providesTags: [GET_LIVERIES]
    }),
    [GET_LIVERY_BY_ID]: builder.query<LiveryDataType, string>({
      query: (id) => {
        return {
          url: `/api/v1/liveries/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 180
    }),
    [CREATE_LIVERY]: builder.mutation<LiveryDataType, CreateLiveryDataType>({
      query: (newLivery) => {
        return {
          url: `/api/v1/liveries`,
          method: 'POST',
          data: newLivery,
          headers: {
            'Content-Type': 'application/json'
          }
        };
      },
      invalidatesTags: [GET_LIVERIES]
    }),
    [DELETE_LIVERY]: builder.mutation<string, string>({
      query: (id) => {
        return {
          url: `/api/v1/liveries/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: [GET_LIVERIES]
    })
  })
});
type LiveryApiSliceRootState = {
  api: ReturnType<typeof liveryApiSlice.reducer>;
};

// HOOKS

export const {
  useGetLiveriesQuery,
  useGetLiveryByIdQuery,
  useCreateLiveryMutation,
  useDeleteLiveryMutation
} = liveryApiSlice;

// ENDPOINTS

export const { getLiveries, getLiveryById, createLivery } =
  liveryApiSlice.endpoints;

// SELECTORS

export const selectGetLiveriesResult = getLiveries.select({});
const selectLiveriesData = createSelector(
  selectGetLiveriesResult,
  (getLiveriesResult) => getLiveriesResult.data
);

export const {
  selectAll: selectAllLiveries,
  selectIds: selectLiveryIds,
  selectById: selectLiveryById
} = liveriesAdapter.getSelectors(
  (state: LiveryApiSliceRootState) => selectLiveriesData(state) ?? initialState
);
