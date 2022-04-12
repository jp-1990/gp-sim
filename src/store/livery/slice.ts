import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { LiveryDataType } from '../../types';
import { normalise } from '../../utils/helpers';

import {
  getLiveries,
  GetLiveriesArgs,
  getLivery,
  GetLiveryArgs
} from '../../api-calls/liveries/get';

export const fetchLiveries = createAsyncThunk(
  'livery/fetchLiveries',
  async ({ filters, quantity }: GetLiveriesArgs) => {
    const liveries = await getLiveries({ filters, quantity });
    return liveries;
  }
);

export const fetchLivery = createAsyncThunk(
  'livery/fetchLivery',
  async ({ id }: GetLiveryArgs) => {
    const livery = await getLivery({ id });
    return livery;
  }
);

interface State {
  ids: string[];
  liveries: Record<string, LiveryDataType>;
}

const initialState: State = {
  ids: [],
  liveries: {}
};

const liverySlice = createSlice({
  name: 'livery',
  initialState,
  reducers: {
    rehydrate: (state, action: PayloadAction<State>) => {
      state.ids = action.payload.ids;
      state.liveries = action.payload.liveries;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLiveries.fulfilled, (state, action) => {
      const { items, ids } = normalise(action.payload);
      state.liveries = items;
      state.ids = ids;
    });
    builder.addCase(fetchLivery.fulfilled, (state, action) => {
      const { payload } = action;
      state.liveries[payload.id] = payload;
    });
  }
});

export const { rehydrate } = liverySlice.actions;
export const liveryReducer = liverySlice.reducer;
export default liverySlice;
