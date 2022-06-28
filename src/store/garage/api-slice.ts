import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import {
  CreateGarageDataType,
  GarageDataType,
  GaragesFilters,
  GaragesResponseType
} from '../../types';
import { apiSlice } from '../store';
import { GET_GARAGES, GET_GARAGE_BY_ID, CREATE_GARAGE } from './constants';

// ADAPTER

const garagesAdapter = createEntityAdapter<GarageDataType>();
const initialState = garagesAdapter.getInitialState({
  perPage: null as null | number,
  page: null as null | number,
  total: null as null | number
});
export type GarageSliceStateType = typeof initialState;

// API SLICE

export const garageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    [GET_GARAGES]: builder.query<GarageSliceStateType, GaragesFilters>({
      query: (filters) => ({
        url: '/garages',
        method: 'GET',
        params: filters
      }),
      transformResponse: (data: GaragesResponseType) => ({
        ...garagesAdapter.setAll(initialState, data.garages),
        perPage: data.perPage,
        page: data.page,
        total: data.total
      }),
      keepUnusedDataFor: 300,
      providesTags: [GET_GARAGES]
    }),
    [GET_GARAGE_BY_ID]: builder.query<GarageDataType, string>({
      query: (id) => {
        return {
          url: `/garages/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 180
    }),
    [CREATE_GARAGE]: builder.mutation<GarageDataType, CreateGarageDataType>({
      query: (newGarage) => {
        return {
          url: `/garages`,
          method: 'POST',
          data: newGarage,
          headers: {
            'Content-Type': 'application/json'
          }
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
  useCreateGarageMutation
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
