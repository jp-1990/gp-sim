import {
  AnyAction,
  createEntityAdapter,
  createSlice,
  EntityId,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import { KeyValueUnionOf, LiveryDataType, Order } from '../../types';
import { LIVERIES_URL } from '../../utils/nav';
import { apiSlice } from '../store';
import { LIVERY_SCROLL_SLICE_NAME } from './constants';

const initialFilters = {
  ids: '',
  search: '',
  car: '',
  priceMin: '00.00',
  priceMax: '00.00',
  created: Order.ASC,
  rating: '0',
  user: ''
};
type FilterState = typeof initialFilters;
export type FilterActionPayload = NonNullable<KeyValueUnionOf<FilterState>>;

type Pages = typeof LIVERIES_URL;

const liveriesAdapter = createEntityAdapter<LiveryDataType>();
const initialState = {
  [LIVERIES_URL]: liveriesAdapter.getInitialState({
    scrollY: null as number | null,
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

        liveriesAdapter.removeAll(state[activePage]);
        state[activePage].lastLiveryId = null;
        if (state[activePage].scrollY) state[activePage].scrollY = null;
      }
    },
    lastLiveryChanged({ activePage, ...state }) {
      if (activePage) {
        state[activePage].lastLiveryId =
          state[activePage].ids[state[activePage].ids.length - 1];
      }
    },
    scrollYChanged(
      { activePage, ...state },
      action: PayloadAction<number | null>
    ) {
      if (activePage) {
        state[activePage].scrollY = action.payload;
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
          liveriesAdapter.addMany(
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
type SelectLiveryScrollSlice<T> = (state: LiveryScrollSliceRootState) => T;

const selectFilters: SelectLiveryScrollSlice<
  LiveryScrollSliceStateType[Pages]['filters']
> = ({ liveryScrollSlice: { activePage, ...state } }) => {
  if (activePage) return state[activePage].filters;
  return initialFilters;
};

const selectLastLiveryId: SelectLiveryScrollSlice<
  LiveryScrollSliceStateType[Pages]['lastLiveryId']
> = ({ liveryScrollSlice: { activePage, ...state } }) => {
  if (activePage) return state[activePage].lastLiveryId;
  return null;
};

const selectScrollY: SelectLiveryScrollSlice<
  LiveryScrollSliceStateType[Pages]['scrollY']
> = ({ liveryScrollSlice: { activePage, ...state } }) => {
  if (activePage) return state[activePage].scrollY;
  return null;
};

export const {
  selectAll: selectAllLiveries,
  selectIds: selectLiveryIds,
  selectEntities: selectLiveryEntities,
  selectById: selectLiveryById
} = liveriesAdapter.getSelectors((state: LiveryScrollSliceRootState) => {
  if (state.liveryScrollSlice.activePage) {
    return state.liveryScrollSlice[state.liveryScrollSlice.activePage];
  }
  return { ids: [], entities: {} };
});
export { selectFilters, selectLastLiveryId, selectScrollY };

export const {
  activatePage,
  filtersChanged,
  lastLiveryChanged,
  scrollYChanged
} = liveryScrollSlice.actions;
export default liveryScrollSlice;
