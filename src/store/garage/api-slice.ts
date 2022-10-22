import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import {
  CreateGarageDataType,
  GarageDataType,
  GaragesFilters,
  GaragesResponseType,
  Method,
  UpdateGarageDataType
} from '../../types';
import { apiSlice } from '../store';
import {
  GET_GARAGES,
  GET_GARAGE_BY_ID,
  CREATE_GARAGE,
  DELETE_GARAGE,
  UPDATE_GARAGE,
  DELETE_LIVERIES_FROM_GARAGE,
  DELETE_USERS_FROM_GARAGE,
  UPDATE_LIVERIES_IN_GARAGE,
  UPDATE_USERS_IN_GARAGE,
  GARAGE_API_ROUTE
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
        url: `${GARAGE_API_ROUTE}`,
        method: Method.GET,
        params: filters
      }),
      transformResponse: (data: GaragesResponseType) =>
        garagesAdapter.setAll(initialState, data),
      keepUnusedDataFor: 300,
      providesTags: [GET_GARAGES]
    }),
    [CREATE_GARAGE]: builder.mutation<GarageDataType, CreateGarageDataType>({
      query: (newGarage) => {
        return {
          url: `${GARAGE_API_ROUTE}`,
          method: Method.POST,
          data: newGarage,
          headers: {
            'Content-Type': 'application/json'
          }
        };
      },
      invalidatesTags: [GET_GARAGES]
    }),
    [GET_GARAGE_BY_ID]: builder.query<GarageDataType, string>({
      query: (id) => ({
        url: `${GARAGE_API_ROUTE}/${id}`,
        method: Method.GET
      }),
      keepUnusedDataFor: 180,
      providesTags: [GET_GARAGE_BY_ID]
    }),
    [UPDATE_GARAGE]: builder.mutation<{ id: string }, UpdateGarageDataType>({
      query: (updateGarage) => {
        const { id, ...data } = updateGarage;
        return {
          data,
          url: `${GARAGE_API_ROUTE}/${id}`,
          method: Method.PATCH,
          headers: {
            'Content-Type': 'application/json'
          }
        };
      },
      invalidatesTags: [GET_GARAGE_BY_ID]
    }),
    [DELETE_GARAGE]: builder.mutation<{ id: string }, string>({
      query: (id) => {
        return {
          url: `${GARAGE_API_ROUTE}/${id}`,
          method: Method.DELETE
        };
      },
      invalidatesTags: [GET_GARAGES]
    }),
    [UPDATE_LIVERIES_IN_GARAGE]: builder.mutation<{ ids: string[] }, string>({
      query: (id) => {
        return {
          url: `${GARAGE_API_ROUTE}/${id}/liveries`,
          method: Method.PATCH
        };
      },
      invalidatesTags: [GET_GARAGES]
    }),
    [DELETE_LIVERIES_FROM_GARAGE]: builder.mutation<{ ids: string[] }, string>({
      query: (id) => {
        return {
          url: `${GARAGE_API_ROUTE}/${id}/liveries`,
          method: Method.DELETE
        };
      },
      invalidatesTags: [GET_GARAGES]
    }),
    [UPDATE_USERS_IN_GARAGE]: builder.mutation<{ ids: string[] }, string>({
      query: (id) => {
        return {
          url: `${GARAGE_API_ROUTE}/${id}/users`,
          method: Method.PATCH
        };
      },
      invalidatesTags: [GET_GARAGES]
    }),
    [DELETE_USERS_FROM_GARAGE]: builder.mutation<{ ids: string[] }, string>({
      query: (id) => {
        return {
          url: `${GARAGE_API_ROUTE}/${id}/users`,
          method: Method.DELETE
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
  useDeleteLiveriesFromGarageMutation,
  useDeleteUsersFromGarageMutation
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
