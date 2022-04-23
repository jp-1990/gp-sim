import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CarDataType } from '../../types';
import { normalise } from '../../utils/functions';

import { getCars } from '../../fetching/cars/get';

export const fetchCars = createAsyncThunk('livery/fetchCars', async () => {
  const cars = await getCars();
  return cars;
});

export interface CarState {
  ids: string[];
  cars: Record<string, CarDataType>;
}

const initialState: CarState = {
  ids: [],
  cars: {}
};

const carSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {
    rehydrateCarSlice: (state, action: PayloadAction<CarState>) => {
      state.ids = action.payload.ids;
      state.cars = action.payload.cars;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCars.fulfilled, (state, action) => {
      const { items, ids } = normalise(action.payload);
      state.cars = items;
      state.ids = ids;
    });
  }
});

export const { rehydrateCarSlice } = carSlice.actions;
export const liveryReducer = carSlice.reducer;
export default carSlice;
