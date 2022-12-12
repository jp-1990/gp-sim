import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import axios from 'axios';
import { HYDRATE } from 'next-redux-wrapper';

import {
  CreateGarageDataType,
  GarageDataType,
  GaragesDataType,
  RequestStatus,
  UpdateGarageDataType
} from '../../types';
import { getTypedThunkPendingAndRejectedCallbacks } from '../../utils/functions';
import { selectors as currentUserSelectors } from '../user/slice';
import {
  CREATE_GARAGE,
  DELETE_GARAGE,
  GARAGE_API_ROUTE,
  GARAGE_SLICE_NAME,
  GET_GARAGES,
  GET_GARAGE_BY_ID,
  UPDATE_GARAGE,
  UPDATE_LIVERIES_IN_GARAGE,
  UPDATE_USERS_IN_GARAGE
} from './constants';

// GARAGE SLICE

// ADAPTERS
const garagesAdapter = createEntityAdapter<GarageDataType>({
  sortComparer: (a, b) => a.title.localeCompare(b.title)
});

// STATE
const initialState = garagesAdapter.getInitialState({
  status: RequestStatus.IDLE as RequestStatus,
  error: null as string | null
});
export type GarageSliceStateType = typeof initialState;
type KnownRootState = { [GARAGE_SLICE_NAME]: GarageSliceStateType };

// THUNKS
const getGarages = createAsyncThunk(
  `${GARAGE_SLICE_NAME}/${GET_GARAGES}`,
  async (_, { getState }) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);

    const { data } = await axios.get<GaragesDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${GARAGE_API_ROUTE}`,
      {
        headers: {
          authorization: token ?? ''
        }
      }
    );

    return data;
  }
);

const createGarage = createAsyncThunk(
  `${GARAGE_SLICE_NAME}/${CREATE_GARAGE}`,
  async (data: CreateGarageDataType, { getState }) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);

    const res = await axios.post<GarageDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${GARAGE_API_ROUTE}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token ?? ''
        }
      }
    );

    return res.data;
  }
);

const getGarageById = createAsyncThunk(
  `${GARAGE_SLICE_NAME}/${GET_GARAGE_BY_ID}`,
  async ({ id }: { id: string }, { getState }) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);

    const res = await axios.get<GarageDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${GARAGE_API_ROUTE}/${id}`,
      {
        headers: {
          authorization: token ?? ''
        }
      }
    );

    return res.data;
  }
);

const updateGarageById = createAsyncThunk(
  `${GARAGE_SLICE_NAME}/${UPDATE_GARAGE}`,
  async ({ id, ...data }: UpdateGarageDataType, { getState }) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);

    const res = await axios.patch<GarageDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${GARAGE_API_ROUTE}/${id}`,
      { data },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token ?? ''
        }
      }
    );

    return res.data;
  }
);

const deleteGarageById = createAsyncThunk(
  `${GARAGE_SLICE_NAME}/${DELETE_GARAGE}`,
  async ({ id }: { id: string }, { getState }) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);

    const res = await axios.delete<{ id: string }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${GARAGE_API_ROUTE}/${id}`,
      {
        headers: {
          authorization: token ?? ''
        }
      }
    );

    return res.data;
  }
);

const updateGarageByIdLiveries = createAsyncThunk(
  `${GARAGE_SLICE_NAME}/${UPDATE_LIVERIES_IN_GARAGE}`,
  async (
    {
      id,
      liveriesToAdd,
      liveriesToRemove
    }: {
      id: string;
      liveriesToAdd?: string[];
      liveriesToRemove?: string[];
    },
    { getState }
  ) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);

    const res = await axios.patch<GarageDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${GARAGE_API_ROUTE}/${id}/liveries`,
      { liveriesToAdd, liveriesToRemove },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token ?? ''
        }
      }
    );

    return res.data;
  }
);

const updateGarageByIdUsers = createAsyncThunk(
  `${GARAGE_SLICE_NAME}/${UPDATE_USERS_IN_GARAGE}`,
  async (
    {
      id,
      usersToAdd,
      usersToRemove
    }: {
      id: string;
      usersToAdd?: string[];
      usersToRemove?: string[];
    },
    { getState }
  ) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);

    const res = await axios.patch<GarageDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${GARAGE_API_ROUTE}/${id}/users`,
      { usersToAdd, usersToRemove },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token ?? ''
        }
      }
    );

    return res.data;
  }
);

const [thunkPending, thunkRejected] =
  getTypedThunkPendingAndRejectedCallbacks<GarageSliceStateType>();

// SLICE
const garageSlice = createSlice({
  name: GARAGE_SLICE_NAME,
  initialState,
  reducers: {
    resetStatus(state) {
      state.error = null;
      state.status = RequestStatus.IDLE;
    }
  },
  extraReducers: (builder) => {
    builder
      // HYDRATE
      .addCase(HYDRATE, (state, _action) => {
        const action = _action as unknown as { payload: KnownRootState };
        return {
          ...state,
          ...action.payload[GARAGE_SLICE_NAME]
        };
      })
      // GET GARAGES
      .addCase(getGarages.pending, thunkPending)
      .addCase(getGarages.rejected, thunkRejected)
      .addCase(
        getGarages.fulfilled,
        (state, action: PayloadAction<GaragesDataType>) => {
          garagesAdapter.setAll(state, action.payload);
          state.error = null;
          state.status = RequestStatus.FULFILLED;
        }
      )
      // CREATE GARAGE
      .addCase(createGarage.pending, thunkPending)
      .addCase(createGarage.rejected, thunkRejected)
      .addCase(
        createGarage.fulfilled,
        (state, action: PayloadAction<GarageDataType>) => {
          garagesAdapter.setOne(state, action.payload);
          state.error = null;
          state.status = RequestStatus.FULFILLED;
        }
      )
      // GET GARAGE BY ID
      .addCase(getGarageById.pending, thunkPending)
      .addCase(getGarageById.rejected, thunkRejected)
      .addCase(
        getGarageById.fulfilled,
        (state, action: PayloadAction<GarageDataType>) => {
          garagesAdapter.setOne(state, action.payload);
          state.error = null;
          state.status = RequestStatus.FULFILLED;
        }
      )
      // UPDATE GARAGE BY ID
      .addCase(updateGarageById.pending, thunkPending)
      .addCase(updateGarageById.rejected, thunkRejected)
      .addCase(
        updateGarageById.fulfilled,
        (state, action: PayloadAction<GarageDataType>) => {
          garagesAdapter.setOne(state, action.payload);
          state.error = null;
          state.status = RequestStatus.FULFILLED;
        }
      )
      // DELETE GARAGE BY ID
      .addCase(deleteGarageById.pending, thunkPending)
      .addCase(deleteGarageById.rejected, thunkRejected)
      .addCase(
        deleteGarageById.fulfilled,
        (state, action: PayloadAction<{ id: string }>) => {
          garagesAdapter.removeOne(state, action.payload.id);
          state.error = null;
          state.status = RequestStatus.FULFILLED;
        }
      )
      // UPDATE GARAGE BY ID LIVERIES
      .addCase(updateGarageByIdLiveries.pending, thunkPending)
      .addCase(updateGarageByIdLiveries.rejected, thunkRejected)
      .addCase(
        updateGarageByIdLiveries.fulfilled,
        (state, action: PayloadAction<GarageDataType>) => {
          garagesAdapter.setOne(state, action.payload);
          state.error = null;
          state.status = RequestStatus.FULFILLED;
        }
      )
      // UPDATE GARAGE BY ID USERS
      .addCase(updateGarageByIdUsers.pending, thunkPending)
      .addCase(updateGarageByIdUsers.rejected, thunkRejected)
      .addCase(
        updateGarageByIdUsers.fulfilled,
        (state, action: PayloadAction<GarageDataType>) => {
          garagesAdapter.setOne(state, action.payload);
          state.error = null;
          state.status = RequestStatus.FULFILLED;
        }
      );
  }
});

// SELECTORS
type SliceSelector<T> = (state: KnownRootState) => T;

const selectStatus: SliceSelector<GarageSliceStateType['status']> = (state) =>
  state[GARAGE_SLICE_NAME].status;

const selectError: SliceSelector<GarageSliceStateType['error']> = (state) =>
  state[GARAGE_SLICE_NAME].error;

const {
  selectAll: selectGarages,
  selectById: selectGarageById,
  selectIds: selectGarageIds,
  selectEntities: selectGarageEntities
} = garagesAdapter.getSelectors(
  (state: KnownRootState) => state[GARAGE_SLICE_NAME]
);

const createSelectGarageById = (id: string) => {
  return (state: KnownRootState) => selectGarageById(state, id);
};

// EXPORTS
export const actions = garageSlice.actions;
export const selectors = {
  createSelectGarageById,
  selectGarages,
  selectGarageEntities,
  selectGarageIds,
  selectError,
  selectStatus
};
export const thunks = {
  getGarages,
  createGarage,
  getGarageById,
  updateGarageById,
  deleteGarageById,
  updateGarageByIdLiveries,
  updateGarageByIdUsers
};
export default garageSlice;
