import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  SerializedError
} from '@reduxjs/toolkit';

import { getCars } from '../../fetching/cars/get';
import { CarDataType, RequestStatus } from '../../types';

export const CAR_SLICE_NAME = 'carSlice';

// ADAPTER

const carsAdapter = createEntityAdapter<CarDataType>({
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});
export const initialState = carsAdapter.getInitialState({
  getCars: {
    status: RequestStatus.IDLE,
    currentRequestId: null as null | string,
    error: null as null | SerializedError
  }
});
export type CarSliceStateType = typeof initialState;
type RootStateFromCarSlice = { [CAR_SLICE_NAME]: CarSliceStateType };

// THUNKS

export const getCarsThunk = createAsyncThunk(
  `${CAR_SLICE_NAME}/fetchCars`,
  async () => {
    const cars = await getCars();
    return cars;
  }
);

// SLICE

const carSlice = createSlice({
  name: CAR_SLICE_NAME,
  initialState,
  reducers: {
    rehydrateCarSlice: (state, action: PayloadAction<CarSliceStateType>) => {
      state.ids = action.payload.ids;
      state.entities = action.payload.entities;
    }
  },
  extraReducers: (builder) => {
    // GET CARS
    builder.addCase(getCarsThunk.pending, (state, action) => {
      state.getCars.status = RequestStatus.PENDING;
      state.getCars.currentRequestId = action.meta.requestId;
    });
    builder.addCase(getCarsThunk.fulfilled, (state, action) => {
      carsAdapter.upsertMany(state, action.payload);
      state.getCars.status = RequestStatus.FULFILLED;
      state.getCars.currentRequestId = null;
    });
    builder.addCase(getCarsThunk.rejected, (state, action) => {
      state.getCars.status = RequestStatus.REJECTED;
      state.getCars.error = action.error;
      state.getCars.currentRequestId = null;
    });
  }
});

// SELECTORS

export const {
  selectById,
  selectAll: selectAllCars,
  selectIds: selectCarIds
} = carsAdapter.getSelectors<RootStateFromCarSlice>(
  (state) => state[CAR_SLICE_NAME]
);
export const selectCarById =
  (id: CarDataType['id']) => (state: RootStateFromCarSlice) =>
    selectById(state, id);

export const { rehydrateCarSlice } = carSlice.actions;
export const carReducer = carSlice.reducer;
export default carSlice;
