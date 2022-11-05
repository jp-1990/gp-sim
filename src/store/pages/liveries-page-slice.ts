import {
  AnyAction,
  createEntityAdapter,
  createSlice,
  EntityId,
  EntityState,
  PayloadAction
} from '@reduxjs/toolkit';
import { KeyValueUnionOf, LiveryDataType, Order } from '../../types';
import { apiSlice } from '../store';
import { LIVERY_PAGE_SLICE_NAME } from './constants';

const liveriesAdapter = createEntityAdapter<LiveryDataType>();
const initialState = liveriesAdapter.getInitialState({
  scrollY: null as number | null,
  filters: {
    ids: '',
    search: '',
    car: '',
    priceMin: '00.00',
    priceMax: '00.00',
    created: Order.ASC,
    rating: '0',
    user: ''
  },
  lastLiveryId: null as EntityId | null
});
export type LiveryPageSliceStateType = typeof initialState;

type FilterState = typeof initialState['filters'];
type FilterActionPayload = NonNullable<KeyValueUnionOf<FilterState>>;

const getLiveriesMatchFulfilled = (action: AnyAction) => {
  return apiSlice.endpoints.getLiveries?.matchFulfilled
    ? apiSlice.endpoints.getLiveries?.matchFulfilled(action)
    : false;
};

const liveriesPageSlice = createSlice({
  name: LIVERY_PAGE_SLICE_NAME,
  initialState,
  reducers: {
    filtersChanged(state, action: PayloadAction<FilterActionPayload>) {
      state.filters = {
        ...state.filters,
        [action.payload.key]: action.payload.value
      };

      liveriesAdapter.removeAll(state);
      state.lastLiveryId = null;
      if (state.scrollY) state.scrollY = null;
    },
    lastLiveryChanged(state) {
      state.lastLiveryId = state.ids[state.ids.length - 1];
    },
    scrollYChanged(state, action: PayloadAction<number | null>) {
      state.scrollY = action.payload;
    }
  },
  extraReducers(builder) {
    builder.addMatcher(
      getLiveriesMatchFulfilled,
      (state, action: PayloadAction<EntityState<LiveryDataType>>) => {
        liveriesAdapter.addMany(
          state,
          action.payload.entities as Record<EntityId, LiveryDataType>
        );
        if (state.scrollY) state.scrollY = null;
      }
    );
  }
});
type LiveryPageSliceRootState = {
  liveryPageSlice: ReturnType<typeof liveriesPageSlice.reducer>;
};
type SelectLiveryPageSlice<T> = (state: LiveryPageSliceRootState) => T;

const selectFilters: SelectLiveryPageSlice<
  LiveryPageSliceStateType['filters']
> = (state) => state.liveryPageSlice.filters;

const selectLastLiveryId: SelectLiveryPageSlice<
  LiveryPageSliceStateType['lastLiveryId']
> = (state) => state.liveryPageSlice.lastLiveryId;

const selectScrollY: SelectLiveryPageSlice<
  LiveryPageSliceStateType['scrollY']
> = (state) => state.liveryPageSlice.scrollY;

export const {
  selectAll: selectAllLiveries,
  selectIds: selectLiveryIds,
  selectEntities: selectLiveryEntities,
  selectById: selectLiveryById
} = liveriesAdapter.getSelectors(
  (state: LiveryPageSliceRootState) => state.liveryPageSlice ?? initialState
);
export { selectFilters, selectLastLiveryId, selectScrollY };

export const { filtersChanged, lastLiveryChanged, scrollYChanged } =
  liveriesPageSlice.actions;
export default liveriesPageSlice;
