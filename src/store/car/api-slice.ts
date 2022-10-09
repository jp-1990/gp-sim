import {
  createEntityAdapter,
  EntityState,
  createSelector
} from '@reduxjs/toolkit';

import { CarDataType, CarsDataType } from '../../types';
import { apiSlice } from '../store';
import { GET_CARS } from './constants';

// ADAPTER

const carsAdapter = createEntityAdapter<CarDataType>({
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});
const initialState = carsAdapter.getInitialState();
export type CarApiSliceStateType = typeof initialState;

// API SLICE

export const carApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    [GET_CARS]: builder.query<EntityState<CarDataType>, void>({
      query: () => ({
        url: '/api/v1/cars',
        method: 'GET'
      }),
      transformResponse: (data: CarsDataType) =>
        carsAdapter.setAll(initialState, data)
    })
  })
});
type CarApiSliceRootState = { api: ReturnType<typeof carApiSlice.reducer> };

// HOOKS

export const { useGetCarsQuery } = carApiSlice;

// ENDPOINTS

export const { getCars } = carApiSlice.endpoints;

// SELECTORS

export const selectGetCarsResult = getCars.select();
const selectCarsData = createSelector(
  selectGetCarsResult,
  (getCarsResult) => getCarsResult.data
);

export const {
  selectAll: selectAllCars,
  selectIds: selectCarIds,
  selectById: selectCarById
} = carsAdapter.getSelectors(
  (state: CarApiSliceRootState) => selectCarsData(state) ?? initialState
);
