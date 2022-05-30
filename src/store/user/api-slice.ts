import { apiSlice } from '../store';
import { LOGIN, LOGOUT } from './constants';
import { UserDataType, UserLoginArgs } from '../../types';

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
    })
  })
});
type UserApiSliceRootState = {
  api: ReturnType<typeof userApiSlice.reducer>;
};

// HOOKS

export const { useLoginMutation, useLogoutMutation } = userApiSlice;

// ENDPOINTS

export const { login, logout } = userApiSlice.endpoints;
