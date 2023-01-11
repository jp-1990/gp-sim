import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import axios from 'axios';

import { GarageDataType, GaragesDataType, RequestStatus } from '../../types';
import { getTypedThunkPendingAndRejectedCallbacks } from '../../utils/functions';
import { selectors as currentUserSelectors } from '../user/slice';
import {
  CREATE_GARAGE,
  DELETE_GARAGE,
  GARAGE_API_ROUTE,
  GARAGE_SLICE_NAME,
  GET_GARAGES,
  GET_GARAGE_BY_ID,
  JOIN_GARAGE,
  LEAVE_GARAGE,
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
    if (!token) return [];

    const uid = currentUserSelectors.selectCurrentUser(state).data?.id || '';
    const garagesState = selectors
      .selectGarages(state)
      .filter((garage) => garage.drivers.includes(uid));

    // cache first. only make a network request if we do not already have data
    if (garagesState.length) return garagesState;

    const { data } = await axios.get<GaragesDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${GARAGE_API_ROUTE}`,
      {
        headers: {
          authorization: token ?? ''
        }
      }
    );

    return data;
  },
  {
    condition: (_, { getState }) => {
      const { [GARAGE_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.status === RequestStatus.PENDING) return false;
      if (state.status === RequestStatus.REJECTED) return false;
      return true;
    }
  }
);

const createGarage = createAsyncThunk(
  `${GARAGE_SLICE_NAME}/${CREATE_GARAGE}`,
  async (data: FormData, { getState }) => {
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
  },
  {
    condition: (_, { getState }) => {
      const { [GARAGE_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.status === RequestStatus.PENDING) return false;
      if (state.status === RequestStatus.REJECTED) return false;
      return true;
    }
  }
);

const getGarageById = createAsyncThunk(
  `${GARAGE_SLICE_NAME}/${GET_GARAGE_BY_ID}`,
  async ({ id }: { id: string }, { getState }) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);
    if (!token) return undefined;

    // cache first. only make a network request if we do not already have data
    const prefetchedGarage = selectors.createSelectGarageById(id)(state);
    if (prefetchedGarage) return prefetchedGarage;

    const res = await axios.get<GarageDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${GARAGE_API_ROUTE}/${id}`,
      {
        headers: {
          authorization: token ?? ''
        }
      }
    );

    return res.data;
  },
  {
    condition: (_, { getState }) => {
      const { [GARAGE_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.status === RequestStatus.PENDING) return false;
      if (state.status === RequestStatus.REJECTED) return false;
      return true;
    }
  }
);

const updateGarageById = createAsyncThunk(
  `${GARAGE_SLICE_NAME}/${UPDATE_GARAGE}`,
  async ({ id, data }: { id: string; data: FormData }, { getState }) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);

    const res = await axios.patch<GarageDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${GARAGE_API_ROUTE}/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token ?? ''
        }
      }
    );

    return res.data;
  },
  {
    condition: (_, { getState }) => {
      const { [GARAGE_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.status === RequestStatus.PENDING) return false;
      if (state.status === RequestStatus.REJECTED) return false;
      return true;
    }
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
  },
  {
    condition: (_, { getState }) => {
      const { [GARAGE_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.status === RequestStatus.PENDING) return false;
      if (state.status === RequestStatus.REJECTED) return false;
      return true;
    }
  }
);

const updateGarageByIdLiveries = createAsyncThunk(
  `${GARAGE_SLICE_NAME}/${UPDATE_LIVERIES_IN_GARAGE}`,
  async (
    {
      id,
      formData
    }: {
      id: string;
      formData: FormData;
    },
    { getState }
  ) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);

    const res = await axios.patch<GarageDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${GARAGE_API_ROUTE}/${id}/liveries`,
      formData,
      {
        headers: {
          authorization: token ?? ''
        }
      }
    );

    return res.data;
  },
  {
    condition: (_, { getState }) => {
      const { [GARAGE_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.status === RequestStatus.PENDING) return false;
      if (state.status === RequestStatus.REJECTED) return false;
      return true;
    }
  }
);

const updateGarageByIdUsers = createAsyncThunk(
  `${GARAGE_SLICE_NAME}/${UPDATE_USERS_IN_GARAGE}`,
  async (
    {
      id,
      formData
    }: {
      id: string;
      formData: FormData;
    },
    { getState }
  ) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);

    const res = await axios.patch<GarageDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${GARAGE_API_ROUTE}/${id}/users`,
      formData,
      {
        headers: {
          authorization: token ?? ''
        }
      }
    );

    return res.data;
  },
  {
    condition: (_, { getState }) => {
      const { [GARAGE_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.status === RequestStatus.PENDING) return false;
      if (state.status === RequestStatus.REJECTED) return false;
      return true;
    }
  }
);

const joinGarage = createAsyncThunk(
  `${GARAGE_SLICE_NAME}/${JOIN_GARAGE}`,
  async (
    {
      id
    }: {
      id: string;
    },
    { getState }
  ) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);

    const res = await axios.post<GarageDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${GARAGE_API_ROUTE}/${id}/join`,
      undefined,
      {
        headers: {
          authorization: token ?? ''
        }
      }
    );

    return res.data;
  },
  {
    condition: (_, { getState }) => {
      const { [GARAGE_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.status === RequestStatus.PENDING) return false;
      if (state.status === RequestStatus.REJECTED) return false;
      return true;
    }
  }
);

const leaveGarage = createAsyncThunk(
  `${GARAGE_SLICE_NAME}/${LEAVE_GARAGE}`,
  async (
    {
      id
    }: {
      id: string;
    },
    { getState }
  ) => {
    const state = getState() as any;
    const token = currentUserSelectors.selectCurrentUserToken(state);

    const res = await axios.post<GarageDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${GARAGE_API_ROUTE}/${id}/leave`,
      undefined,
      {
        headers: {
          authorization: token ?? ''
        }
      }
    );

    return res.data;
  },
  {
    condition: (_, { getState }) => {
      const { [GARAGE_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.status === RequestStatus.PENDING) return false;
      if (state.status === RequestStatus.REJECTED) return false;
      return true;
    }
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
    },
    setGarage(state, action: PayloadAction<GarageDataType>) {
      garagesAdapter.setOne(state, action.payload);
    },
    setGarages(state, action: PayloadAction<GaragesDataType>) {
      garagesAdapter.setMany(state, action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
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
        (state, action: PayloadAction<GarageDataType | undefined>) => {
          if (action.payload) garagesAdapter.setOne(state, action.payload);
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
      )
      // JOIN GARAGE
      .addCase(joinGarage.pending, thunkPending)
      .addCase(joinGarage.rejected, thunkRejected)
      .addCase(
        joinGarage.fulfilled,
        (state, action: PayloadAction<GarageDataType>) => {
          garagesAdapter.setOne(state, action.payload);
          state.error = null;
          state.status = RequestStatus.FULFILLED;
        }
      )
      // LEAVE GARAGE
      .addCase(leaveGarage.pending, thunkPending)
      .addCase(leaveGarage.rejected, thunkRejected)
      .addCase(
        leaveGarage.fulfilled,
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

const createSelectUserCreatedGarageIds =
  (uid: string) => (state: KnownRootState) => {
    const garages = selectGarages(state);
    const filteredIds: string[] = [];
    for (const garage of garages) {
      if (garage.creator.id === uid) filteredIds.push(garage.id);
    }
    return filteredIds;
  };

const createSelectUserCreatedGarageEntities =
  (uid: string) => (state: KnownRootState) => {
    const garages = selectGarages(state);
    const filteredEntities: Record<string, GarageDataType> = {};
    for (const garage of garages) {
      if (garage.creator.id === uid) filteredEntities[garage.id] = garage;
    }
    return filteredEntities;
  };

const createSelectUserInGarageIds =
  (uid: string) => (state: KnownRootState) => {
    const garages = selectGarages(state);
    const filteredIds: string[] = [];
    for (const garage of garages) {
      if (garage.drivers.includes(uid)) filteredIds.push(garage.id);
    }
    return filteredIds;
  };

const createSelectUserInGarageEntities =
  (uid: string) => (state: KnownRootState) => {
    const garages = selectGarages(state);
    const filteredEntities: Record<string, GarageDataType> = {};
    for (const garage of garages) {
      if (garage.drivers.includes(uid)) filteredEntities[garage.id] = garage;
    }
    return filteredEntities;
  };

const createSelectGarageById = (id: string) => {
  return (state: KnownRootState) => selectGarageById(state, id);
};

// EXPORTS
export const actions = garageSlice.actions;
export const selectors = {
  createSelectGarageById,
  createSelectUserCreatedGarageEntities,
  createSelectUserCreatedGarageIds,
  createSelectUserInGarageEntities,
  createSelectUserInGarageIds,
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
  joinGarage,
  leaveGarage,
  updateGarageById,
  deleteGarageById,
  updateGarageByIdLiveries,
  updateGarageByIdUsers
};
export default garageSlice;
