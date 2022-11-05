import {
  createEntityAdapter,
  createSelector,
  EntityState
} from '@reduxjs/toolkit';

import {
  LiveryDataType,
  CreateLiveryDataType,
  LiveriesFilters,
  Method,
  LiveriesDataType
} from '../../types';
import { apiSlice } from '../store';
import {
  GET_LIVERIES,
  GET_LIVERY_BY_ID,
  CREATE_LIVERY,
  DELETE_LIVERY,
  LIVERIES_API_ROUTE
} from './constants';

// ADAPTER

const liveriesAdapter = createEntityAdapter<LiveryDataType>();
const initialState = liveriesAdapter.getInitialState();
export type LiverySliceStateType = typeof initialState;

// API SLICE

export const liveryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    [GET_LIVERIES]: builder.query<
      LiverySliceStateType,
      Partial<Record<keyof LiveriesFilters, string | number>>
    >({
      query: (filters) => ({
        url: `${LIVERIES_API_ROUTE}`,
        method: Method.GET,
        params: filters
      }),
      transformResponse: (data: LiveriesDataType) => {
        return liveriesAdapter.setAll(initialState, data);
      },
      keepUnusedDataFor: 300,
      providesTags: [GET_LIVERIES]
    }),
    [CREATE_LIVERY]: builder.mutation<LiveryDataType, CreateLiveryDataType>({
      query: (newLivery) => {
        return {
          url: `${LIVERIES_API_ROUTE}`,
          method: Method.POST,
          data: newLivery,
          headers: {
            'Content-Type': 'application/json'
          }
        };
      },
      invalidatesTags: [GET_LIVERIES]
    }),
    [GET_LIVERY_BY_ID]: builder.query<LiveryDataType, string>({
      query: (id) => {
        return {
          url: `${LIVERIES_API_ROUTE}/${id}`,
          method: Method.GET
        };
      },
      keepUnusedDataFor: 180
    }),
    [DELETE_LIVERY]: builder.mutation<{ id: string }, string>({
      query: (id) => {
        return {
          url: `${LIVERIES_API_ROUTE}/${id}`,
          method: Method.DELETE
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
// @ts-expect-error no idea
export const selectGetLiveriesResult = getLiveries.select({});
const selectLiveriesData = createSelector(
  selectGetLiveriesResult,
  (getLiveriesResult) => getLiveriesResult.data as EntityState<LiveryDataType>
);

export const {
  selectAll: selectAllLiveries,
  selectIds: selectLiveryIds,
  selectById: selectLiveryById
} = liveriesAdapter.getSelectors(
  // @ts-expect-error no idea
  (state: LiveryApiSliceRootState) => selectLiveriesData(state) ?? initialState
);
