import { useReducer } from 'react';
import { KeyValueUnionOf, Order } from '../types';

const initialState = {
  ids: '',
  search: '',
  car: '',
  created: Order.ASC,
  garages: '',
  user: '0',
  page: 0
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

  const setFilters = (payload: ActionPayload) => {
    dispatch({
      type: payload.key,
      payload: payload
    });
  };

  return {
    filters,
    setFilters
  };
};
