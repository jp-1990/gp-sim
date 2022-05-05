import { CarDataType, RequestStatusType } from '../../types';

export interface CarSliceState extends RequestStatusType {
  ids: string[];
  cars: Record<string, CarDataType>;
}

export const initialState: CarSliceState = {
  ids: [],
  cars: {},
  loading: false,
  error: false,
  currentRequestId: null
};
