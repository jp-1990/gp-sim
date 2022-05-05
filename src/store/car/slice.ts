import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CarSliceState, initialState } from './state';
import { normalise } from '../../utils/functions';

import { getCars } from '../../fetching/cars/get';

const CAR_SLICE_NAME = 'car';

export const getCarsThunk = createAsyncThunk(
  `${CAR_SLICE_NAME}/fetchCars`,
  async () => {
    const cars = await getCars();
    return cars;
  }
);

const carSlice = createSlice({
  name: CAR_SLICE_NAME,
  initialState,
  reducers: {
    rehydrateCarSlice: (state, action: PayloadAction<CarSliceState>) => {
      state.ids = action.payload.ids;
      state.cars = action.payload.cars;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getCarsThunk.fulfilled, (state, action) => {
      if (!action.payload) return;
      const { items, ids } = normalise(action.payload);
      state.ids = ids;
      state.cars = items;
    });
  }
});

export const { rehydrateCarSlice } = carSlice.actions;
export const carReducer = carSlice.reducer;
export default carSlice;

export type { CarSliceState } from './state';
