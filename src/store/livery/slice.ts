import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { LiveryDataType } from '../../types';
import { normalise } from '../../utils/functions';

import {
  getLiveries,
  GetLiveriesArgs,
  getLivery,
  GetLiveryArgs
} from '../../fetching/liveries/get';
import { postLivery, PostLiveryArgs } from '../../fetching/liveries/post';

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

export const createLivery = createAsyncThunk(
  'livery/createLivery',
  async (newLivery: PostLiveryArgs) => {
    const livery = await postLivery(newLivery);
    return livery;
  }
);

export interface LiveryState {
  ids: string[];
  liveries: Record<string, LiveryDataType>;
}

const initialState: LiveryState = {
  ids: [],
  liveries: {}
};

const liverySlice = createSlice({
  name: 'livery',
  initialState,
  reducers: {
    rehydrateLiverySlice: (state, action: PayloadAction<LiveryState>) => {
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
    builder.addCase(createLivery.fulfilled, (state, action) => {
      const { payload } = action;
      state.ids.push(payload.id);
      state.liveries[payload.id] = payload;
    });
  }
});

export const { rehydrateLiverySlice } = liverySlice.actions;
export const liveryReducer = liverySlice.reducer;
export default liverySlice;
