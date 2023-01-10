import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import axios from 'axios';
import { HYDRATE } from 'next-redux-wrapper';

import {
  KeyValueUnionOf,
  Limits,
  LiveriesDataType,
  LiveriesFilters,
  LiveryDataType,
  Order,
  RequestStatus
} from '../../types';
import {
  applyLiveryFilters,
  LIVERY_BATCH_SIZE
} from '../../utils/filtering/livery';
import { getTypedThunkPendingAndRejectedCallbacks } from '../../utils/functions';
import {
  GARAGES_URL,
  GARAGES_URL_ID,
  LIVERIES_URL,
  PROFILE_URL,
  PROFILE_URL_ID
} from '../../utils/nav';
import { selectors as currentUserSelectors } from '../user/slice';
import { LIVERIES_API_ROUTE, LIVERY_SLICE_NAME } from './constants';

const initialFilters = {
  ids: '',
  search: '',
  car: '',
  created: Order.ASC,
  rating: '0',
  isPublic: null
};
type FilterState = typeof initialFilters;
export type FilterActionPayload = NonNullable<KeyValueUnionOf<FilterState>>;

type Pages =
  | typeof LIVERIES_URL
  | typeof GARAGES_URL
  | typeof GARAGES_URL_ID
  | typeof PROFILE_URL
  | typeof PROFILE_URL_ID;

const liveriesAdapter = createEntityAdapter<LiveryDataType>();

const initialState = {
  [LIVERIES_URL]: {
    scrollY: null as number | null,
    filters: { ...initialFilters, isPublic: true },
    liveryIds: [] as string[],
    lastLiveryId: null as string | null,
    hasMore: null as boolean | null
  },
  [GARAGES_URL]: {
    scrollY: null as number | null,
    selectedGarage: 'NULL' as string | null,
    selectedLiveries: [] as string[],
    filters: { ...initialFilters },
    liveryIds: [] as string[],
    lastLiveryId: null as string | null,
    hasMore: null as boolean | null
  },
  [GARAGES_URL_ID]: {
    scrollY: null as number | null,
    selectedLiveries: [] as string[],
    filters: { ...initialFilters },
    liveryIds: [] as string[],
    lastLiveryId: null as string | null,
    hasMore: null as boolean | null
  },
  [PROFILE_URL]: {
    scrollY: null as number | null,
    filters: { ...initialFilters },
    liveryIds: [] as string[],
    lastLiveryId: null as string | null,
    hasMore: null as boolean | null
  },
  [PROFILE_URL_ID]: {
    scrollY: null as number | null,
    filters: { ...initialFilters, isPublic: true },
    liveryIds: [] as string[],
    lastLiveryId: null as string | null,
    hasMore: null as boolean | null
  },
  activePage: null as Pages | null,
  liveries: liveriesAdapter.getInitialState(),
  error: null as null | string,
  status: RequestStatus.IDLE as RequestStatus
};
export type LiverySliceStateType = typeof initialState;
type KnownRootState = { [LIVERY_SLICE_NAME]: LiverySliceStateType };

// THUNKS
const getLiveries = createAsyncThunk(
  `${LIVERY_SLICE_NAME}/getLiveries`,
  async (args: Partial<LiveriesFilters>, { getState }) => {
    const state = getState() as KnownRootState;
    const liveriesState = selectors.selectLiveries(state);

    // cache first. only make a network request if we do not already have data
    if (liveriesState.length) return applyLiveryFilters(liveriesState, args);

    const res = await axios.get<LiveriesDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${LIVERIES_API_ROUTE}`,
      {
        params: args
      }
    );
    return res.data;
  },
  {
    condition: (args, { getState }) => {
      const { [LIVERY_SLICE_NAME]: state } = getState() as KnownRootState;
      const activePage = state.activePage;

      if (state.status === RequestStatus.PENDING) return false;
      if (state.status === RequestStatus.REJECTED) return false;
      if (!activePage) return false;
      if (state[activePage].filters.ids !== args.ids) return false;
      if (state[activePage].hasMore === false) return false;

      return true;
    }
  }
);

const getLiveryDownloadUrl = createAsyncThunk(
  `${LIVERY_SLICE_NAME}/getLiveryDownloadUrl`,
  async ({ id }: { id: string }, { getState }) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);

    const res = await axios.get<string>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${LIVERIES_API_ROUTE}/download/${id}`,
      {
        headers: {
          authorization: token ?? ''
        }
      }
    );
    return res.data;
  },
  {
    condition: (_, { getState }) => {
      const { [LIVERY_SLICE_NAME]: state } = getState() as KnownRootState;
      if (state.status === RequestStatus.PENDING) return false;
      if (state.status === RequestStatus.REJECTED) return false;
      return true;
    }
  }
);

const createLivery = createAsyncThunk(
  `${LIVERY_SLICE_NAME}/createLivery`,
  async (data: FormData, { getState }) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);

    const res = await axios.post<LiveryDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${LIVERIES_API_ROUTE}`,
      data,
      {
        headers: {
          authorization: token ?? ''
        }
      }
    );
    return res.data;
  },
  {
    condition: (_, { getState }) => {
      const { [LIVERY_SLICE_NAME]: state } = getState() as KnownRootState;
      if (state.status === RequestStatus.PENDING) return false;
      if (state.status === RequestStatus.REJECTED) return false;
      return true;
    }
  }
);

const deleteLiveryById = createAsyncThunk(
  `${LIVERY_SLICE_NAME}/deleteLivery`,
  async ({ id }: { id: string }, { getState }) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);

    const res = await axios.delete<LiveryDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${LIVERIES_API_ROUTE}/${id}`,
      {
        headers: {
          authorization: token ?? ''
        }
      }
    );
    return res.data;
  },
  {
    condition: (_, { getState }) => {
      const { [LIVERY_SLICE_NAME]: state } = getState() as KnownRootState;
      if (state.status === RequestStatus.PENDING) return false;
      if (state.status === RequestStatus.REJECTED) return false;
      return true;
    }
  }
);

const [thunkPending, thunkRejected] =
  getTypedThunkPendingAndRejectedCallbacks<LiverySliceStateType>();

// SLICE
const liverySlice = createSlice({
  name: LIVERY_SLICE_NAME,
  initialState,
  reducers: {
    activatePage(state, action: PayloadAction<Pages | null>) {
      state.activePage = action.payload;
    },
    filtersChanged(state, action: PayloadAction<FilterActionPayload>) {
      const activePage = state.activePage;
      if (activePage) {
        state[activePage].filters = {
          ...state[activePage].filters,
          [action.payload.key]: action.payload.value
        };

        state[activePage].liveryIds = [];
        state[activePage].lastLiveryId = null;
        state[activePage].hasMore = null;
        if (state[activePage].scrollY) state[activePage].scrollY = null;
      }
    },
    scrollYChanged(state, action: PayloadAction<number | null>) {
      const activePage = state.activePage;
      if (activePage) {
        state[activePage].scrollY = action.payload;
      }
    },
    selectedGarageChanged(state, action: PayloadAction<string | null>) {
      const activePage = state.activePage;
      if (
        activePage === GARAGES_URL &&
        state[GARAGES_URL].selectedGarage !== action.payload
      ) {
        state[GARAGES_URL].scrollY = null;
        state[GARAGES_URL].hasMore = null;
        state[GARAGES_URL].liveryIds = [];
        state[GARAGES_URL].selectedLiveries = [];
        state[GARAGES_URL].selectedGarage = action.payload;
      }
    },
    selectedLiveriesChanged(state, action: PayloadAction<string | string[]>) {
      const activePage = state.activePage;
      if (activePage === GARAGES_URL || activePage === GARAGES_URL_ID) {
        let newState = state[activePage].selectedLiveries;
        if (typeof action.payload === 'string') {
          if (state[activePage].selectedLiveries.includes(action.payload)) {
            newState = state[activePage].selectedLiveries.filter(
              (id) => id !== action.payload
            );
          }
          if (!state[activePage].selectedLiveries.includes(action.payload)) {
            newState.push(action.payload);
          }
        } else if (Array.isArray(action.payload)) {
          if (!action.payload.length) newState = [];
          if (action.payload.length) {
            newState = [...new Set([...newState, ...action.payload])];
          }
        }

        state[activePage].selectedLiveries = newState;
      }
    },
    setLivery(state, action: PayloadAction<LiveryDataType>) {
      liveriesAdapter.setOne(state.liveries, action.payload);
    },
    setLiveries(state, action: PayloadAction<LiveriesDataType>) {
      liveriesAdapter.setMany(state.liveries, action.payload);
    }
  },
  extraReducers(builder) {
    //  HYDRATE
    builder.addCase(HYDRATE, (state, _action) => {
      const action = _action as unknown as { payload: KnownRootState };
      const liveriesServerState = action.payload[LIVERY_SLICE_NAME].liveries;
      const liveriesArray: LiveriesDataType = [];

      for (const id of liveriesServerState.ids) {
        const livery = liveriesServerState.entities[id];
        if (livery) liveriesArray.push(livery);
      }

      liveriesAdapter.setMany(state.liveries, liveriesArray);
    });

    // GET LIVERIES
    builder.addCase(getLiveries.pending, thunkPending);
    builder.addCase(getLiveries.rejected, thunkRejected);
    builder.addCase(getLiveries.fulfilled, (state, action) => {
      const activePage = state.activePage;

      if (activePage) {
        const newIds = action.payload.map(({ id }) => id);
        const existingIds = state[activePage].liveryIds;

        liveriesAdapter.setMany(state.liveries, action.payload);
        if (state[activePage].scrollY) state[activePage].scrollY = null;
        if (newIds.length < Limits.LIVERIES) state[activePage].hasMore = false;
        state[activePage].liveryIds = [...new Set([...existingIds, ...newIds])];
        if (newIds.length === LIVERY_BATCH_SIZE)
          state[activePage].lastLiveryId = newIds[newIds.length - 1];
      }

      state.error = null;
      state.status = RequestStatus.FULFILLED;
    });

    // CREATE LIVERY
    builder.addCase(createLivery.pending, thunkPending);
    builder.addCase(createLivery.rejected, thunkRejected);
    builder.addCase(createLivery.fulfilled, (state, action) => {
      liveriesAdapter.setOne(state.liveries, action.payload);
      state.error = null;
      state.status = RequestStatus.FULFILLED;
    });

    // DELETE LIVERY
    builder.addCase(deleteLiveryById.pending, thunkPending);
    builder.addCase(deleteLiveryById.rejected, thunkRejected);
    builder.addCase(deleteLiveryById.fulfilled, (state, action) => {
      liveriesAdapter.removeOne(state.liveries, action.payload.id);
      state.error = null;
      state.status = RequestStatus.FULFILLED;
    });
  }
});

// SELECTORS

const selectLiverySlice = (state: KnownRootState) => state[LIVERY_SLICE_NAME];

const selectFilters = createSelector(
  selectLiverySlice,
  ({ activePage, ...state }) => {
    if (activePage) return state[activePage].filters;
    return initialFilters;
  }
);

const selectLastLiveryId = createSelector(
  selectLiverySlice,
  ({ activePage, ...state }) => {
    if (activePage) return state[activePage].lastLiveryId;
    return null;
  }
);

const selectLiveryIds = createSelector(
  selectLiverySlice,
  ({ activePage, ...state }) => {
    if (activePage) return state[activePage].liveryIds;
    return [];
  }
);

const selectLiveryEntities = createSelector(
  selectLiverySlice,
  ({ activePage, ...state }) => {
    if (activePage) {
      const ids = state[activePage].liveryIds;
      const entities = {} as Record<string, LiveryDataType | undefined>;
      for (const id of ids) entities[id] = state.liveries.entities[id];
      return entities;
    }
    return {};
  }
);

const createSelectScrollY = (page: Pages) =>
  createSelector(selectLiverySlice, ({ activePage, ...state }) => {
    if (activePage && page === activePage) return state[activePage].scrollY;
    return null;
  });

const selectSelectedGarage = createSelector(selectLiverySlice, (state) => {
  return state[GARAGES_URL].selectedGarage;
});

const selectSelectedLiveries = createSelector(
  selectLiverySlice,
  ({ activePage, ...state }) => {
    if (activePage === GARAGES_URL || activePage === GARAGES_URL_ID)
      return state[activePage].selectedLiveries;
    return [];
  }
);

const selectStatus = (state: KnownRootState) => state[LIVERY_SLICE_NAME].status;

const { selectAll: selectLiveries } = liveriesAdapter.getSelectors(
  (state: KnownRootState) => state[LIVERY_SLICE_NAME].liveries
);

const createSelectUserCreatedLiveryIds =
  (uid: string) => (state: KnownRootState) => {
    const liveries = selectLiveries(state);
    const filteredIds: string[] = [];
    for (const livery of liveries) {
      if (livery.creator.id === uid) filteredIds.push(livery.id);
    }
    return filteredIds;
  };

const createSelectUserCreatedLiveryEntities =
  (uid: string) => (state: KnownRootState) => {
    const liveries = selectLiveries(state);
    const filteredEntities: Record<string, LiveryDataType> = {};
    for (const livery of liveries) {
      if (livery.creator.id === uid) filteredEntities[livery.id] = livery;
    }
    return filteredEntities;
  };

// EXPORTS
export const actions = liverySlice.actions;
export const selectors = {
  createSelectScrollY,
  createSelectUserCreatedLiveryEntities,
  createSelectUserCreatedLiveryIds,
  selectLiveries,
  selectFilters,
  selectLastLiveryId,
  selectLiveryIds,
  selectLiveryEntities,
  selectSelectedGarage,
  selectSelectedLiveries,
  selectStatus
};
export const thunks = {
  createLivery,
  deleteLiveryById,
  getLiveries,
  getLiveryDownloadUrl
};
export default liverySlice;
