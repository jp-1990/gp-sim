import { apiSlice } from '../store';
import { GET_USERS, GET_USER_BY_ID, UPDATE_PROFILE } from './constants';
import {
  PublicUserDataType,
  Token,
  UpdateUserProfileDataType,
  UserDataType,
  UserFilters
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
        url: '/api/v1/users',
        method: 'GET',
        params: filters
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
          url: `/api/v1/users/${id ?? -1}`,
          method: 'GET'
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
          url: `/api/v1/users/current`,
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: token
          }
        };
      }
    })
  })
});
type UserApiSliceRootState = {
  api: ReturnType<typeof userApiSlice.reducer>;
};

// HOOKS

export const {
  useUpdateUserProfileMutation,
  useGetUsersQuery,
  useGetUserByIdQuery
} = userApiSlice;

// ENDPOINTS

export const { getUserById, getUsers } = userApiSlice.endpoints;
