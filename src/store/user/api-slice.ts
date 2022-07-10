import { apiSlice } from '../store';
import {
  GET_USERS,
  GET_USER_BY_ID,
  LOGIN,
  LOGOUT,
  UPDATE_PROFILE
} from './constants';
import {
  PublicUserDataType,
  UpdateUserProfileDataType,
  UserDataType,
  UserLoginArgs
} from '../../types';
import { createEntityAdapter } from '@reduxjs/toolkit';

// ADAPTER

const usersAdapter = createEntityAdapter<PublicUserDataType>();
const initialState = usersAdapter.getInitialState();

export type UserSliceStateType = typeof initialState;

// USER API SLICE

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    [LOGIN]: builder.mutation<UserDataType, UserLoginArgs>({
      query: (credentials) => {
        return {
          url: `/login`,
          method: 'POST',
          data: credentials,
          headers: {
            'Content-Type': 'application/json'
          }
        };
      }
    }),
    [LOGOUT]: builder.mutation<boolean, void>({
      query: () => {
        return {
          url: `/logout`,
          method: 'POST'
        };
      }
    }),
    [GET_USERS]: builder.query<UserSliceStateType, undefined>({
      query: () => ({
        url: '/users',
        method: 'GET'
      }),
      transformResponse: (data: PublicUserDataType[]) =>
        usersAdapter.setAll(initialState, data),
      keepUnusedDataFor: 300,
      providesTags: [GET_USERS]
    }),
    [GET_USER_BY_ID]: builder.query<
      PublicUserDataType,
      string | number | undefined
    >({
      query: (id) => {
        return {
          url: `/users/${id ?? -1}`,
          method: 'GET'
        };
      }
    }),
    [UPDATE_PROFILE]: builder.mutation<UserDataType, UpdateUserProfileDataType>(
      {
        query: (updateData) => {
          const { id, ...data } = updateData;
          return {
            data,
            url: `/users/${id}`,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            }
          };
        }
      }
    )
  })
});
type UserApiSliceRootState = {
  api: ReturnType<typeof userApiSlice.reducer>;
};

// HOOKS

export const {
  useLoginMutation,
  useLogoutMutation,
  useUpdateUserProfileMutation,
  useGetUserByIdQuery
} = userApiSlice;

// ENDPOINTS

export const { login, logout, getUserById, getUsers } = userApiSlice.endpoints;
