import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import {
  CreateGarageDataType,
  GarageDataType,
  GaragesFilters,
  GaragesResponseType,
  UpdateGarageDataType
} from '../../types';
import { apiSlice } from '../store';
import {
  GET_GARAGES,
  GET_GARAGE_BY_ID,
  CREATE_GARAGE,
  DELETE_GARAGE,
  UPDATE_GARAGE,
  DELETE_LIVERY_FROM_GARAGE,
  DELETE_USER_FROM_GARAGE
} from './constants';

// ADAPTER

const garagesAdapter = createEntityAdapter<GarageDataType>();
const initialState = garagesAdapter.getInitialState();
export type GarageSliceStateType = typeof initialState;

// API SLICE

export const garageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    [GET_GARAGES]: builder.query<GarageSliceStateType, GaragesFilters>({
      query: (filters) => ({
        url: '/api/v1/garages',
        method: 'GET',
        params: filters
      }),
      transformResponse: (data: GaragesResponseType) =>
        garagesAdapter.setAll(initialState, data),
      keepUnusedDataFor: 300,
      providesTags: [GET_GARAGES]
    }),
    [GET_GARAGE_BY_ID]: builder.query<GarageDataType, string>({
      query: (id) => ({
        url: `/api/v1/garages/${id}`,
        method: 'GET'
      }),
      keepUnusedDataFor: 180,
      providesTags: [GET_GARAGE_BY_ID]
    }),
    [CREATE_GARAGE]: builder.mutation<GarageDataType, CreateGarageDataType>({
      query: (newGarage) => {
        return {
          url: `/api/v1/garages`,
          method: 'POST',
          data: newGarage,
          headers: {
            'Content-Type': 'application/json'
          }
        };
      },
      invalidatesTags: [GET_GARAGES]
    }),
    [UPDATE_GARAGE]: builder.mutation<GarageDataType, UpdateGarageDataType>({
      query: (updateGarage) => {
        const { id, ...data } = updateGarage;
        return {
          data,
          url: `/api/v1/garages/${id}`,
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          }
        };
      },
      invalidatesTags: [GET_GARAGE_BY_ID]
    }),
    [DELETE_GARAGE]: builder.mutation<string, string>({
      query: (id) => {
        return {
          url: `/api/v1/garages/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: [GET_GARAGES]
    }),
    [DELETE_LIVERY_FROM_GARAGE]: builder.mutation<string, string>({
      query: (id) => {
        return {
          url: `/api/v1/garages/livery/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: [GET_GARAGES]
    }),
    [DELETE_USER_FROM_GARAGE]: builder.mutation<string, string>({
      query: (id) => {
        return {
          url: `/api/v1/garages/user/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: [GET_GARAGES]
    })
  })
});
type GarageApiSliceRootState = {
  api: ReturnType<typeof garageApiSlice.reducer>;
};

// HOOKS

export const {
  useGetGaragesQuery,
  useGetGarageByIdQuery,
  useCreateGarageMutation,
  useUpdateGarageMutation,
  useDeleteGarageMutation,
  useDeleteLiveryFromGarageMutation,
  useDeleteUserFromGarageMutation
} = garageApiSlice;

// ENDPOINTS

export const { getGarages, getGarageById, createGarage } =
  garageApiSlice.endpoints;

// SELECTORS

export const selectGetGaragesResult = getGarages.select({});
const selectGaragesData = createSelector(
  selectGetGaragesResult,
  (getGaragesResult) => getGaragesResult.data
);

export const {
  selectAll: selectAllGarages,
  selectIds: selectGarageIds,
  selectById: selectGarageById
} = garagesAdapter.getSelectors(
  (state: GarageApiSliceRootState) => selectGaragesData(state) ?? initialState
);
