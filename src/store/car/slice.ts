import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import axios from 'axios';
import { HYDRATE } from 'next-redux-wrapper';

import { CarDataType, CarsDataType, RequestStatus } from '../../types';
import { getTypedThunkPendingAndRejectedCallbacks } from '../../utils/functions';
import { CARS_API_ROUTE, CAR_SLICE_NAME, GET_CARS } from './constants';

// CARS SLICE

// ADAPTERS
const carsAdapter = createEntityAdapter<CarDataType>({
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});

// STATE
const initialState = carsAdapter.getInitialState({
  status: RequestStatus.IDLE as RequestStatus,
  error: null as string | null
});
export type CarSliceStateType = typeof initialState;
type KnownRootState = { [CAR_SLICE_NAME]: CarSliceStateType };

// THUNKS
const getCars = createAsyncThunk(
  `${CAR_SLICE_NAME}/${GET_CARS}`,
  async (_, { getState }) => {
    const state = getState() as KnownRootState;
    const existingCars = selectCars(state);
    if (existingCars.length) return existingCars;

    const { data } = await axios.get<CarsDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${CARS_API_ROUTE}`
    );

    return data;
  }
);

const [thunkPending, thunkRejected] =
  getTypedThunkPendingAndRejectedCallbacks<CarSliceStateType>();

// SLICE
const carSlice = createSlice({
  name: CAR_SLICE_NAME,
  initialState,
  reducers: {
    resetStatus(state) {
      state.error = null;
      state.status = RequestStatus.IDLE;
    },
    setCars(state, action: PayloadAction<CarsDataType>) {
      carsAdapter.setAll(state, action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, _action) => {
        const action = _action as unknown as { payload: KnownRootState };
        return {
          ...state,
          ...action.payload[CAR_SLICE_NAME]
        };
      })
      .addCase(getCars.pending, thunkPending)
      .addCase(getCars.rejected, thunkRejected)
      .addCase(
        getCars.fulfilled,
        (state, action: PayloadAction<CarsDataType>) => {
          carsAdapter.setAll(state, action.payload);
          state.error = null;
          state.status = RequestStatus.FULFILLED;
        }
      );
  }
});

// SELECTORS
type SliceSelector<T> = (state: KnownRootState) => T;

const selectStatus: SliceSelector<CarSliceStateType['status']> = (state) =>
  state[CAR_SLICE_NAME].status;

const selectError: SliceSelector<CarSliceStateType['error']> = (state) =>
  state[CAR_SLICE_NAME].error;

const {
  selectAll: selectCars,
  selectIds: selectCarIds,
  selectEntities: selectCarEntities
} = carsAdapter.getSelectors((state: KnownRootState) => state[CAR_SLICE_NAME]);

// EXPORTS
export const actions = carSlice.actions;
export const selectors = {
  selectCars,
  selectCarEntities,
  selectCarIds,
  selectError,
  selectStatus
};
export const thunks = { getCars };
export default carSlice;
