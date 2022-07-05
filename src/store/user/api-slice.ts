import { apiSlice } from '../store';
import { LOGIN, LOGOUT, UPDATE_PROFILE } from './constants';
import {
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
  useUpdateUserProfileMutation
} = userApiSlice;

// ENDPOINTS

export const { login, logout } = userApiSlice.endpoints;
