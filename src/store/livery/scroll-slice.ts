import {
  AnyAction,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityId,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import { KeyValueUnionOf, LiveryDataType, Order } from '../../types';
import { GARAGES_URL, LIVERIES_URL } from '../../utils/nav';
import { apiSlice } from '../store';
import { LIVERY_SCROLL_SLICE_NAME } from './constants';

const initialFilters = {
  ids: '',
  search: '',
  car: '',
  created: Order.ASC,
  rating: '0'
};
type FilterState = typeof initialFilters;
export type FilterActionPayload = NonNullable<KeyValueUnionOf<FilterState>>;

type Pages = typeof LIVERIES_URL | typeof GARAGES_URL;

const adapters = {
  [LIVERIES_URL]: createEntityAdapter<LiveryDataType>(),
  [GARAGES_URL]: createEntityAdapter<LiveryDataType>()
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
  activePage: null as Pages | null
};
export type LiveryScrollSliceStateType = typeof initialState;

const getLiveriesMatchFulfilled = (action: AnyAction) => {
  return apiSlice.endpoints.getLiveries?.matchFulfilled
    ? apiSlice.endpoints.getLiveries?.matchFulfilled(action)
    : false;
};

const liveryScrollSlice = createSlice({
  name: LIVERY_SCROLL_SLICE_NAME,
  initialState,
  reducers: {
    activatePage(state, action: PayloadAction<Pages | null>) {
      state.activePage = action.payload;
    },
    filtersChanged(
      { activePage, ...state },
      action: PayloadAction<FilterActionPayload>
    ) {
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
    lastLiveryChanged({ activePage, ...state }) {
      if (activePage) {
        state[activePage].lastLiveryId =
          state[activePage].ids[state[activePage].ids.length - 1] ?? null;
      }
    },
    scrollYChanged(
      { activePage, ...state },
      action: PayloadAction<number | null>
    ) {
      if (activePage) {
        state[activePage].scrollY = action.payload;
      }
    },
    selectedGarageChanged(
      { activePage, ...state },
      action: PayloadAction<string | null>
    ) {
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
    selectedLiveriesChanged(
      { activePage, ...state },
      action: PayloadAction<string | string[]>
    ) {
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
    builder.addMatcher(
      getLiveriesMatchFulfilled,
      (
        { activePage, ...state },
        action: PayloadAction<EntityState<LiveryDataType>>
      ) => {
        if (activePage) {
          adapters[activePage].addMany(
            state[activePage],
            action.payload.entities as Record<EntityId, LiveryDataType>
          );
          if (state[activePage].scrollY) state[activePage].scrollY = null;
        }
      }
    );
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

const selectScrollY = createSelector(
  selectLiveryScrollSlice,
  ({ activePage, ...state }) => {
    if (activePage) return state[activePage].scrollY;
    return null;
  }
);

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
  selectFilters,
  selectLastLiveryId,
  selectLiveryIds,
  selectLiveryEntities,
  selectScrollY,
  selectSelectedGarage,
  selectSelectedLiveries
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
