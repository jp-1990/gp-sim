import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState, LiverySliceState } from './state';
import { normalise } from '../../utils/functions';

import {
  getLiveries,
  GetLiveriesArgs,
  getLivery,
  GetLiveryArgs
} from '../../fetching/liveries/get';
import { postLivery, PostLiveryArgs } from '../../fetching/liveries/post';

const LIVERY_SLICE_NAME = 'livery';

export const getLiveriesThunk = createAsyncThunk(
  `${LIVERY_SLICE_NAME}/getLiveries`,
  async ({ filters, quantity }: GetLiveriesArgs) => {
    const liveries = await getLiveries({ filters, quantity });
    return liveries;
  }
);

export const getLiveryThunk = createAsyncThunk(
  `${LIVERY_SLICE_NAME}/getLivery`,
  async ({ id }: GetLiveryArgs) => {
    const livery = await getLivery({ id });
    return livery;
  }
);

export const postLiveryThunk = createAsyncThunk(
  `${LIVERY_SLICE_NAME}/postLivery`,
  async (newLivery: PostLiveryArgs) => {
    const livery = await postLivery(newLivery);
    return livery;
  }
);

const liverySlice = createSlice({
  name: LIVERY_SLICE_NAME,
  initialState,
  reducers: {
    rehydrateLiverySlice: (state, action: PayloadAction<LiverySliceState>) => {
      state.ids = action.payload.ids;
      state.liveries = action.payload.liveries;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getLiveriesThunk.fulfilled, (state, action) => {
      const { items, ids } = normalise(action.payload);
      state.liveries = items;
      state.ids = ids;
    });
    builder.addCase(getLiveryThunk.fulfilled, (state, action) => {
      const { payload } = action;
      state.liveries[payload.id] = payload;
    });
    builder.addCase(postLiveryThunk.fulfilled, (state, action) => {
      const { payload } = action;
      state.ids.push(payload.id);
      state.liveries[payload.id] = payload;
    });
  }
});

export const { rehydrateLiverySlice } = liverySlice.actions;
export const liveryReducer = liverySlice.reducer;
export default liverySlice;

export type { LiverySliceState } from './state';
