import { useCallback, useReducer } from 'react';
import { KeyValueUnionOf, Order } from '../types';

const initialState = {
  ids: '',
  search: '',
  car: '',
  priceMin: '00.00',
  priceMax: '00.00',
  created: Order.ASC,
  rating: '0',
  user: ''
};

type FilterState = typeof initialState;
type ActionPayload = NonNullable<KeyValueUnionOf<FilterState>>;
type Action = {
  type: keyof FilterState;
  payload: ActionPayload;
};
const filtersReducer = (state: FilterState, action: Action): FilterState => {
  return {
    ...state,
    [action.payload.key]: action.payload.value
  };
};

export const useLiveryFilters = () => {
  const [filters, dispatch] = useReducer(filtersReducer, initialState);

  const setFilters = useCallback(
    (payload: ActionPayload) => {
      dispatch({
        type: payload.key,
        payload: payload
      });
    },
    [dispatch]
  );

  return {
    filters,
    setFilters
  };
};

export type SetFiltersType = (payload: ActionPayload) => void;
export type FiltersType = FilterState;
