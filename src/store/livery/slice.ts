import {
  createEntityAdapter,
  createSelector,
  EntityState
} from '@reduxjs/toolkit';

import {
  LiveriesDataType,
  LiveryDataType,
  CreateLiveryDataType
} from '../../types';
import { apiSlice } from '../store';
import { GET_LIVERIES, GET_LIVERY_BY_ID, CREATE_LIVERY } from './constants';

// ADAPTER

const liveriesAdapter = createEntityAdapter<LiveryDataType>({
  sortComparer: (a, b) => b.downloads - a.downloads
});
const initialState = liveriesAdapter.getInitialState();
export type LiverySliceStateType = typeof initialState;

// API SLICE

export const liveryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    [GET_LIVERIES]: builder.query<EntityState<LiveryDataType>, void>({
      query: () => ({
        url: '/liveries',
        method: 'GET'
      }),
      transformResponse: (data: LiveriesDataType) =>
        liveriesAdapter.setAll(initialState, data),
      keepUnusedDataFor: 300,
      providesTags: [GET_LIVERIES]
    }),
    [GET_LIVERY_BY_ID]: builder.query<LiveryDataType, string>({
      query: (id) => {
        return {
          url: `/liveries/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 180
    }),
    [CREATE_LIVERY]: builder.mutation<LiveryDataType, CreateLiveryDataType>({
      query: (newLivery) => {
        return {
          url: `/liveries`,
          method: 'POST',
          data: newLivery,
          headers: {
            'Content-Type': 'application/json'
          }
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
  useCreateLiveryMutation
} = liveryApiSlice;

// ENDPOINTS

export const { getLiveries, getLiveryById, createLivery } =
  liveryApiSlice.endpoints;

// SELECTORS

export const selectGetLiveriesResult = getLiveries.select();
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
