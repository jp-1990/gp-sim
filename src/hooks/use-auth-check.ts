import Router from 'next/router';
import { useEffect } from 'react';
import { useAppSelector } from '../store/store';
import { LOGIN_URL } from '../utils/nav';

/**
 * Hook to get current user state, and redirect user if they are not logged in
 */
export const useAuthCheck = () => {
  const currentUser = useAppSelector((state) => state.currentUserSlice);
  useEffect(() => {
    if (!currentUser.token) {
      Router.push(LOGIN_URL);
    }
  }, [currentUser.token]);
  return { currentUser };
};
