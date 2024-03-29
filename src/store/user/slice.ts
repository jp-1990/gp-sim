import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import axios from 'axios';
import Router from 'next/router';

import {
  ALLOWED_RESET_PASSWORD_ERRORS,
  USER_SLICE_NAME,
  USERS_API_ROUTE,
  GET_USERS,
  GET_USER_BY_ID,
  CURRENT
} from './constants';
import {
  CreateUserProfileDataType,
  RequestStatus,
  UserDataType,
  UserFilters,
  UsersDataType
} from '../../types';
import { auth, signInWithEmailAndPassword } from '../../utils/firebase/client';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getTypedThunkPendingAndRejectedCallbacks } from '../../utils/functions';
import { applyUserFilters } from '../../utils/filtering/user';

// ADAPTERS
const usersAdapter = createEntityAdapter<UserDataType>({
  sortComparer: (a, b) => a.displayName.localeCompare(b.displayName)
});

// CURRENT USER SLICE
const initialState = {
  currentUser: {
    token: null as string | null,
    data: null as UserDataType | null,
    status: 'idle' as RequestStatus,
    error: null as string | null
  },
  users: usersAdapter.getInitialState({
    status: 'idle' as RequestStatus,
    error: null as string | null
  })
};
export type UserSliceStateType = typeof initialState;
type KnownRootState = { [USER_SLICE_NAME]: UserSliceStateType };

const getUsers = createAsyncThunk(
  `${USER_SLICE_NAME}/${GET_USERS}`,
  async (filters: UserFilters, { getState }) => {
    const state = getState() as any;
    const token = selectors.selectCurrentUserToken(state);
    if (!token) return [];

    // cache first. only make a network request if we do not already have data
    const prefetchedUsers = selectors.selectUsers(state);
    if (prefetchedUsers.length)
      return applyUserFilters(prefetchedUsers, filters);

    const res = await axios.get<UsersDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${USERS_API_ROUTE}`,
      {
        headers: {
          authorization: token ?? ''
        },
        params: filters
      }
    );

    return res.data;
  },
  {
    condition: (_, { getState }) => {
      const { [USER_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.users.status === RequestStatus.PENDING) return false;
      return true;
    }
  }
);

const getUserById = createAsyncThunk(
  `${USER_SLICE_NAME}/${GET_USER_BY_ID}`,
  async ({ id }: { id: string }, { getState }) => {
    const state = getState() as any;
    const token = selectors.selectCurrentUserToken(state);
    if (!token) return undefined;

    // cache first. only make a network request if we do not already have data
    const prefetchedUser = selectors.createSelectUserById(id)(state);
    if (prefetchedUser) return prefetchedUser;

    const res = await axios.get<UserDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${USERS_API_ROUTE}/${id}`,
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
      const { [USER_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.users.status === RequestStatus.PENDING) return false;
      return true;
    }
  }
);

const signIn = createAsyncThunk(
  `${USER_SLICE_NAME}/signIn`,
  async (
    { email, password }: { email: string; password: string },
    { dispatch, getState }
  ) => {
    const state = getState() as KnownRootState;
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const token = await user.getIdToken();

    // cache first. only make a network request if we do not already have data
    const prefetchedUser = selectors.createSelectUserById(user.uid)(state);
    if (prefetchedUser) {
      Router.back();
      return prefetchedUser;
    }

    const res = await axios.get<UserDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${USERS_API_ROUTE}${CURRENT}`,
      {
        headers: {
          authorization: token ?? ''
        }
      }
    );
    dispatch(actions.setToken(token));

    Router.back();
    return res.data;
  },
  {
    condition: (_, { getState }) => {
      const { [USER_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.currentUser.status === RequestStatus.PENDING) return false;
      return true;
    }
  }
);

const signUp = createAsyncThunk(
  `${USER_SLICE_NAME}/signUp`,
  async (
    userDetails_: CreateUserProfileDataType & { password: string },
    { dispatch }
  ) => {
    const { password, ...userDetails } = userDetails_;
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userDetails.email,
      password
    );
    const { user } = userCredential;

    // use token from sign in to create user doc
    const token = await user.getIdToken();
    const res = await axios.post<UserDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${USERS_API_ROUTE}`,
      {
        data: userDetails
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      }
    );
    dispatch(actions.setToken(token));

    await sendEmailVerification(user);
    Router.push('/');

    return res.data;
  },
  {
    condition: (_, { getState }) => {
      const { [USER_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.currentUser.status === RequestStatus.PENDING) return false;
      return true;
    }
  }
);

const signOut = createAsyncThunk(
  `${USER_SLICE_NAME}/signOut`,
  async () => {
    await Router.push('/');
    await auth.signOut();
  },
  {
    condition: (_, { getState }) => {
      const { [USER_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.currentUser.status === RequestStatus.PENDING) return false;
      return true;
    }
  }
);

const resetPassword = createAsyncThunk(
  `${USER_SLICE_NAME}/resetPassword`,
  async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }
);

const getCurrentUser = createAsyncThunk(
  `${USER_SLICE_NAME}/getCurrentUser`,
  async (_, { getState }) => {
    const state = getState() as any;
    const token = selectors.selectCurrentUserToken(state);

    const uid = auth.currentUser?.uid;

    // cache first. only make a network request if we do not already have data
    const prefetchedUser = selectors.createSelectUserById(uid || '')(state);
    if (prefetchedUser) {
      return prefetchedUser;
    }

    const res = await axios.get<UserDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${USERS_API_ROUTE}${CURRENT}`,
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
      const { [USER_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.currentUser.status === RequestStatus.PENDING) return false;
      return true;
    }
  }
);

const updateCurrentUser = createAsyncThunk(
  `${USER_SLICE_NAME}/updateCurrentUser`,
  async (data: FormData, { getState }) => {
    const state = getState() as any;
    const token = selectors.selectCurrentUserToken(state);

    const res = await axios.patch<UserDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${USERS_API_ROUTE}${CURRENT}`,
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
      const { [USER_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.currentUser.status === RequestStatus.PENDING) return false;
      return true;
    }
  }
);

const updateCurrentUserLiveries = createAsyncThunk(
  `${USER_SLICE_NAME}/updateCurrentUserLiveries`,
  async (data: { liveries: string[] }, { getState }) => {
    const state = getState() as any;
    const token = selectors.selectCurrentUserToken(state);

    const res = await axios.patch<UserDataType>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${USERS_API_ROUTE}${CURRENT}/liveries`,
      { data },
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
      const { [USER_SLICE_NAME]: state } = getState() as KnownRootState;

      if (state.currentUser.status === RequestStatus.PENDING) return false;
      return true;
    }
  }
);

const [usersThunkPending, usersThunkRejected, usersThunkFulfilled] =
  getTypedThunkPendingAndRejectedCallbacks<UserSliceStateType['users']>();

const [
  currentUserThunkPending,
  currentUserThunkRejected,
  currentUserThunkFulfileld
] =
  getTypedThunkPendingAndRejectedCallbacks<UserSliceStateType['currentUser']>();

const userSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState,
  reducers: {
    resetStatus(state) {
      state.currentUser.error = null;
      state.currentUser.status = RequestStatus.IDLE;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.currentUser.token = action.payload;
    },
    setUser(state, action: PayloadAction<UserDataType>) {
      usersAdapter.setOne(state.users, action.payload);
    },
    setUsers(state, action: PayloadAction<UsersDataType>) {
      usersAdapter.setMany(state.users, action.payload);
    },
    updateLiveries(state, action: PayloadAction<string[]>) {
      const newState = { ...state };
      for (const livery of action.payload)
        newState.currentUser.data?.liveries.push(livery);
      return newState;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET USERS
      .addCase(getUsers.pending, (state) => {
        usersThunkPending(state.users);
      })
      .addCase(getUsers.rejected, (state, action) => {
        usersThunkRejected(state.users, action);
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        usersThunkFulfilled(state.users);
        usersAdapter.setAll(state.users, action.payload);
      })

      // GET USER BY ID
      .addCase(getUserById.pending, (state) => {
        usersThunkPending(state.users);
      })
      .addCase(getUserById.rejected, (state, action) => {
        usersThunkRejected(state.users, action);
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        usersThunkFulfilled(state.users);
        if (action.payload) usersAdapter.setOne(state.users, action.payload);
      })

      // SIGN IN
      .addCase(signIn.pending, (state) => {
        currentUserThunkPending(state.currentUser);
        state.currentUser.data = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        currentUserThunkRejected(state.currentUser, action);
        state.currentUser.data = null;
        state.currentUser.token = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        currentUserThunkFulfileld(state.currentUser);
        state.currentUser.data = action.payload;
      })

      // SIGN UP
      .addCase(signUp.pending, (state) => {
        currentUserThunkPending(state.currentUser);
        state.currentUser.data = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        currentUserThunkRejected(state.currentUser, action);
        state.currentUser.data = null;
        state.currentUser.token = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        currentUserThunkFulfileld(state.currentUser);
        state.currentUser.data = action.payload;
      })

      // SIGN OUT
      .addCase(signOut.fulfilled, (state) => {
        state.currentUser.data = null;
        state.currentUser.token = null;
        state.currentUser.error = null;
        state.currentUser.status = RequestStatus.FULFILLED;
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        currentUserThunkPending(state.currentUser);
      })
      .addCase(resetPassword.rejected, (state, action) => {
        if (
          action.error.code &&
          !ALLOWED_RESET_PASSWORD_ERRORS.includes(action.error.code)
        ) {
          currentUserThunkRejected(state.currentUser, action);
          state.currentUser.data = null;
          state.currentUser.token = null;
        } else {
          state.currentUser.status = RequestStatus.IDLE;
        }
      })
      .addCase(resetPassword.fulfilled, (state) => {
        currentUserThunkFulfileld(state.currentUser);
        state.currentUser.data = null;
        state.currentUser.token = null;
      })

      // GET CURRENT USER
      .addCase(getCurrentUser.pending, (state) => {
        currentUserThunkPending(state.currentUser);
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        currentUserThunkRejected(state.currentUser, action);
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        currentUserThunkFulfileld(state.currentUser);
        state.currentUser.data = action.payload;
        usersAdapter.setOne(state.users, action.payload);
      })

      // UPDATE CURRENT USER
      .addCase(updateCurrentUser.pending, (state) => {
        currentUserThunkPending(state.currentUser);
      })
      .addCase(updateCurrentUser.rejected, (state, action) => {
        currentUserThunkRejected(state.currentUser, action);
      })
      .addCase(updateCurrentUser.fulfilled, (state, action) => {
        currentUserThunkFulfileld(state.currentUser);
        state.currentUser.data = action.payload;
        usersAdapter.setOne(state.users, action.payload);
      })

      // UPDATE CURRENT USER LIVERIES
      .addCase(updateCurrentUserLiveries.pending, (state) => {
        currentUserThunkPending(state.currentUser);
      })
      .addCase(updateCurrentUserLiveries.rejected, (state, action) => {
        currentUserThunkRejected(state.currentUser, action);
      })
      .addCase(updateCurrentUserLiveries.fulfilled, (state, action) => {
        currentUserThunkFulfileld(state.currentUser);
        state.currentUser.data = action.payload;
        usersAdapter.setOne(state.users, action.payload);
      });
  }
});

// SELECTORS
type SliceSelector<T> = (state: KnownRootState) => T;

const selectCurrentUserStatus: SliceSelector<
  UserSliceStateType['currentUser']['status']
> = (state) => state[USER_SLICE_NAME].currentUser.status;

const selectCurrentUserError: SliceSelector<
  UserSliceStateType['currentUser']['error']
> = (state) => state[USER_SLICE_NAME].currentUser.error;

const selectCurrentUserToken: SliceSelector<
  UserSliceStateType['currentUser']['token']
> = (state) => state[USER_SLICE_NAME].currentUser.token;

const selectCurrentUser: SliceSelector<UserSliceStateType['currentUser']> = (
  state
) => state[USER_SLICE_NAME].currentUser;

const selectUsersStatus: SliceSelector<
  UserSliceStateType['users']['status']
> = (state) => state[USER_SLICE_NAME].users.status;

const selectUsersError: SliceSelector<UserSliceStateType['users']['error']> = (
  state
) => state[USER_SLICE_NAME].users.error;

const {
  selectAll: selectUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  selectEntities: selectUserEntities
} = usersAdapter.getSelectors(
  (state: KnownRootState) => state[USER_SLICE_NAME].users
);

const createSelectUserById = (id: string) => {
  return (state: KnownRootState) => selectUserById(state, id);
};

// EXPORTS
export const actions = userSlice.actions;
export const selectors = {
  createSelectUserById,
  selectCurrentUser,
  selectCurrentUserError,
  selectCurrentUserStatus,
  selectCurrentUserToken,
  selectUsers,
  selectUsersError,
  selectUsersStatus,
  selectUserIds,
  selectUserEntities
};
export const thunks = {
  getCurrentUser,
  getUsers,
  getUserById,
  signIn,
  signOut,
  signUp,
  resetPassword,
  updateCurrentUser,
  updateCurrentUserLiveries
};
export default userSlice;
