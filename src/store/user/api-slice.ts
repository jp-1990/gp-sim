import { apiSlice } from '../store';
import {
  GET_USERS,
  GET_USER_BY_ID,
  UPDATE_PROFILE,
  USERS_API_ROUTE
} from './constants';
import {
  Method,
  PublicUserDataType,
  Token,
  UpdateUserProfileDataType,
  UserDataType,
  UserFilters,
  UsersDataType
} from '../../types';
import { createEntityAdapter } from '@reduxjs/toolkit';

// ADAPTER

const usersAdapter = createEntityAdapter<PublicUserDataType>();
const initialState = usersAdapter.getInitialState();

export type UserSliceStateType = typeof initialState;

// USER API SLICE

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    [GET_USERS]: builder.query<UserSliceStateType, UserFilters>({
      query: (filters) => ({
        url: `${USERS_API_ROUTE}`,
        method: Method.GET,
        params: filters
      }),
      transformResponse: (data: UsersDataType) =>
        usersAdapter.setAll(initialState, data),
      keepUnusedDataFor: 300,
      providesTags: [GET_USERS]
    }),
    [GET_USER_BY_ID]: builder.query<PublicUserDataType, string>({
      query: (id) => {
        return {
          url: `${USERS_API_ROUTE}/${id}`,
          method: Method.GET
        };
      }
    }),
    [UPDATE_PROFILE]: builder.mutation<
      UserDataType,
      UpdateUserProfileDataType & Token
    >({
      query: (updateData) => {
        const { token, ...data } = updateData;
        return {
          data,
          url: `${USERS_API_ROUTE}/current`,
          method: Method.PATCH,
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        };
      }
    })
  })
});

// HOOKS

export const {
  useUpdateUserProfileMutation,
  useGetUsersQuery,
  useGetUserByIdQuery
} = userApiSlice;

// ENDPOINTS

export const { getUserById, getUsers } = userApiSlice.endpoints;
