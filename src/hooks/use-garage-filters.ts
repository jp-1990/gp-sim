import { useCallback, useReducer } from 'react';
import { KeyValueUnionOf, Order } from '../types';

const initialState = {
  ids: '',
  search: '',
  created: Order.ASC,
  user: '',
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

export const useGarageFilters = () => {
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
