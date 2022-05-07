import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  SerializedError
} from '@reduxjs/toolkit';

import {
  getLiveries,
  GetLiveriesArgs,
  getLivery,
  GetLiveryArgs
} from '../../fetching/liveries/get';
import { postLivery, PostLiveryArgs } from '../../fetching/liveries/post';
import { LiveryDataType, RequestStatus } from '../../types';

export const LIVERY_SLICE_NAME = 'liverySlice';

// ADAPTER

const liveriesAdapter = createEntityAdapter<LiveryDataType>({
  sortComparer: (a, b) => b.downloads - a.downloads
});
export const initialState = liveriesAdapter.getInitialState({
  getLiveries: {
    status: RequestStatus.IDLE,
    currentRequestId: null,
    error: null as null | SerializedError
  }
});
export type LiverySliceStateType = typeof initialState;
type RootStateFromLiverySlice = { [LIVERY_SLICE_NAME]: LiverySliceStateType };

// THUNKS

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

// SLICE

const liverySlice = createSlice({
  name: LIVERY_SLICE_NAME,
  initialState,
  reducers: {
    rehydrateLiverySlice: (
      state,
      action: PayloadAction<LiverySliceStateType>
    ) => {
      state.ids = action.payload.ids;
      state.entities = action.payload.entities;
    }
  },
  extraReducers: (builder) => {
    // GET LIVERIES
    builder.addCase(getLiveriesThunk.pending, (state) => {
      state.getLiveries.status = RequestStatus.PENDING;
    });
    builder.addCase(getLiveriesThunk.fulfilled, (state, action) => {
      state.getLiveries.status = RequestStatus.FULFILLED;
      liveriesAdapter.upsertMany(state, action.payload);
    });
    builder.addCase(getLiveriesThunk.rejected, (state, action) => {
      state.getLiveries.status = RequestStatus.REJECTED;
      state.getLiveries.error = action.error;
    });

    // GET LIVERY
    builder.addCase(getLiveryThunk.fulfilled, (state, action) => {
      liveriesAdapter.addOne(state, action.payload);
    });

    // POST LIVERY
    builder.addCase(postLiveryThunk.fulfilled, (state, action) => {
      liveriesAdapter.addOne(state, action.payload);
    });
  }
});

// SELECTORS

export const {
  selectById,
  selectAll: selectAllLiveries,
  selectIds: selectLiveryIds
} = liveriesAdapter.getSelectors<RootStateFromLiverySlice>(
  (state) => state[LIVERY_SLICE_NAME]
);
export const selectLiveryById =
  (id: LiveryDataType['id']) => (state: RootStateFromLiverySlice) =>
    selectById(state, id);

export const { rehydrateLiverySlice } = liverySlice.actions;
export const liveryReducer = liverySlice.reducer;
export default liverySlice;
