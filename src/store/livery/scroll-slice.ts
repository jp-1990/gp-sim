import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityId,
  PayloadAction,
  SerializedError
} from '@reduxjs/toolkit';
import axios from 'axios';
import {
  KeyValueUnionOf,
  LiveriesDataType,
  LiveriesFilters,
  LiveryDataType,
  Order,
  RequestStatus
} from '../../types';
import {
  GARAGES_URL,
  LIVERIES_URL,
  PROFILE_URL,
  PROFILE_URL_ID
} from '../../utils/nav';
import { LIVERIES_API_ROUTE, LIVERY_SCROLL_SLICE_NAME } from './constants';

const initialFilters = {
  ids: '',
  search: '',
  car: '',
  created: Order.ASC,
  rating: '0'
};
type FilterState = typeof initialFilters;
export type FilterActionPayload = NonNullable<KeyValueUnionOf<FilterState>>;

type Pages =
  | typeof LIVERIES_URL
  | typeof GARAGES_URL
  | typeof PROFILE_URL
  | typeof PROFILE_URL_ID;

const adapters = {
  [LIVERIES_URL]: createEntityAdapter<LiveryDataType>(),
  [GARAGES_URL]: createEntityAdapter<LiveryDataType>(),
  [PROFILE_URL]: createEntityAdapter<LiveryDataType>(),
  [PROFILE_URL_ID]: createEntityAdapter<LiveryDataType>()
};
const initialState = {
  [LIVERIES_URL]: adapters[LIVERIES_URL].getInitialState({
    scrollY: null as number | null,
    filters: { ...initialFilters },
    lastLiveryId: null as EntityId | null
  }),
  [GARAGES_URL]: adapters[GARAGES_URL].getInitialState({
    scrollY: null as number | null,
    selectedGarage: 'NULL' as string | null,
    selectedLiveries: [] as string[],
    filters: { ...initialFilters },
    lastLiveryId: null as EntityId | null
  }),
  [PROFILE_URL]: adapters[PROFILE_URL].getInitialState({
    scrollY: null as number | null,
    filters: { ...initialFilters },
    lastLiveryId: null as EntityId | null
  }),
  [PROFILE_URL_ID]: adapters[PROFILE_URL_ID].getInitialState({
    scrollY: null as number | null,
    filters: { ...initialFilters },
    lastLiveryId: null as EntityId | null
  }),
  activePage: null as Pages | null,
  error: null as null | SerializedError,
  status: RequestStatus.IDLE as RequestStatus
};
export type LiveryScrollSliceStateType = typeof initialState;

// THUNKS
const getLiveries = createAsyncThunk(
  `${LIVERY_SCROLL_SLICE_NAME}/getLiveries`,
  async (args: Partial<LiveriesFilters>) => {
    const { data } = await axios.get<LiveriesDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${LIVERIES_API_ROUTE}`,
      {
        params: args
      }
    );
    return data;
  },
  {
    condition: (args, { getState }) => {
      const { [LIVERY_SCROLL_SLICE_NAME]: state } =
        getState() as LiveryScrollSliceRootState;
      if (state.status === RequestStatus.PENDING) return false;
      if (state.activePage && state[state.activePage].filters.ids !== args.ids)
        return false;
    }
  }
);

// SLICE
const liveryScrollSlice = createSlice({
  name: LIVERY_SCROLL_SLICE_NAME,
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

        adapters[activePage].removeAll(state[activePage]);
        state[activePage].lastLiveryId = null;
        if (state[activePage].scrollY) state[activePage].scrollY = null;
      }
    },
    lastLiveryChanged(state) {
      const activePage = state.activePage;
      if (activePage) {
        state[activePage].lastLiveryId =
          state[activePage].ids[state[activePage].ids.length - 1] ?? null;
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
        adapters[GARAGES_URL].removeAll(state[GARAGES_URL]);
        state[GARAGES_URL].selectedLiveries = [];
        state[GARAGES_URL].selectedGarage = action.payload;
      }
    },
    selectedLiveriesChanged(state, action: PayloadAction<string | string[]>) {
      const activePage = state.activePage;
      if (activePage === GARAGES_URL) {
        let newState = state[GARAGES_URL].selectedLiveries;
        if (typeof action.payload === 'string') {
          if (state[GARAGES_URL].selectedLiveries.includes(action.payload)) {
            newState = state[GARAGES_URL].selectedLiveries.filter(
              (id) => id !== action.payload
            );
          }
          if (!state[GARAGES_URL].selectedLiveries.includes(action.payload)) {
            newState.push(action.payload);
          }
        } else if (Array.isArray(action.payload)) {
          if (!action.payload.length) newState = [];
          if (action.payload.length) {
            newState = [...new Set([...newState, ...action.payload])];
          }
        }

        state[GARAGES_URL].selectedLiveries = newState;
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(getLiveries.pending, (state) => {
      // todo loading state
      state.error = null;
      state.status = RequestStatus.PENDING;
    });
    builder.addCase(getLiveries.rejected, (state, action) => {
      // todo error state
      state.error = action.error;
      state.status = RequestStatus.REJECTED;
    });
    builder.addCase(getLiveries.fulfilled, (state, action) => {
      const activePage = state.activePage;
      if (activePage) {
        adapters[activePage].addMany(state[activePage], action.payload);
        if (state[activePage].scrollY) state[activePage].scrollY = null;
        state.error = null;
        state.status = RequestStatus.FULFILLED;
      }
    });
  }
});
type LiveryScrollSliceRootState = {
  liveryScrollSlice: ReturnType<typeof liveryScrollSlice.reducer>;
};

const selectLiveryScrollSlice = (state: LiveryScrollSliceRootState) =>
  state.liveryScrollSlice;

const selectFilters = createSelector(
  selectLiveryScrollSlice,
  ({ activePage, ...state }) => {
    if (activePage) return state[activePage].filters;
    return initialFilters;
  }
);

const selectLastLiveryId = createSelector(
  selectLiveryScrollSlice,
  ({ activePage, ...state }) => {
    if (activePage) return state[activePage].lastLiveryId;
    return null;
  }
);

const selectLiveryIds = createSelector(
  selectLiveryScrollSlice,
  ({ activePage, ...state }) => {
    if (activePage) return state[activePage].ids;
    return [];
  }
);

const selectLiveryEntities = createSelector(
  selectLiveryScrollSlice,
  ({ activePage, ...state }) => {
    if (activePage) return state[activePage].entities;
    return {};
  }
);

const createSelectScrollY = (page: Pages) =>
  createSelector(selectLiveryScrollSlice, ({ activePage, ...state }) => {
    if (activePage && page === activePage) return state[activePage].scrollY;
    return null;
  });

const selectSelectedGarage = createSelector(
  selectLiveryScrollSlice,
  (state) => {
    return state[GARAGES_URL].selectedGarage;
  }
);

const selectSelectedLiveries = createSelector(
  selectLiveryScrollSlice,
  (state) => {
    return state[GARAGES_URL].selectedLiveries;
  }
);

export {
  createSelectScrollY,
  selectFilters,
  selectLastLiveryId,
  selectLiveryIds,
  selectLiveryEntities,
  selectSelectedGarage,
  selectSelectedLiveries
};

export const thunks = {
  getLiveries
};

export const {
  activatePage,
  filtersChanged,
  lastLiveryChanged,
  scrollYChanged,
  selectedGarageChanged,
  selectedLiveriesChanged
} = liveryScrollSlice.actions;
export default liveryScrollSlice;
