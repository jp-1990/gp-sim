import {
  createEntityAdapter,
  createSelector,
  EntityState
} from '@reduxjs/toolkit';

import { LiveriesDataType, LiveryDataType } from '../../types';
import { apiSlice } from '../store';

export const LIVERY_SLICE_NAME = 'liverySlice';

// ADAPTER

const liveriesAdapter = createEntityAdapter<LiveryDataType>({
  sortComparer: (a, b) => b.downloads - a.downloads
});
const initialState = liveriesAdapter.getInitialState();
export type LiverySliceStateType = typeof initialState;

// API SLICE

export const liveryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLiveries: builder.query<EntityState<LiveryDataType>, void>({
      query: () => ({
        url: '/liveries',
        method: 'GET'
      }),
      transformResponse: (data: LiveriesDataType) =>
        liveriesAdapter.setAll(initialState, data),
      keepUnusedDataFor: 300
    }),
    getLiveryById: builder.query<LiveryDataType, string>({
      query: (id) => {
        return {
          url: `/liveries/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 180
    })
  })
});
type LiveryApiSliceRootState = {
  api: ReturnType<typeof liveryApiSlice.reducer>;
};

// HOOKS

export const { useGetLiveriesQuery, useGetLiveryByIdQuery } = liveryApiSlice;

// ENDPOINTS

export const { getLiveries, getLiveryById } = liveryApiSlice.endpoints;

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
