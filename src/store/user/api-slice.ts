import { apiSlice } from '../store';
import { GET_USER_BY_ID, LOGIN, LOGOUT, UPDATE_PROFILE } from './constants';
import {
  PublicUserDataType,
  UpdateUserProfileDataType,
  UserDataType,
  UserLoginArgs
} from '../../types';

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
    [GET_USER_BY_ID]: builder.query<PublicUserDataType, string | number>({
      query: (id) => {
        return {
          url: `/user/${id}`,
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
            url: `/user/${id}`,
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

export const { login, logout, getUserById } = userApiSlice.endpoints;
