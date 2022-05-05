import { LiveryDataType, RequestStatusType } from '../../types';

export interface LiverySliceState extends RequestStatusType {
  ids: string[];
  liveries: Record<string, LiveryDataType>;
}

export const initialState: LiverySliceState = {
  ids: [],
  liveries: {},
  loading: false,
  error: false,
  currentRequestId: null
};
