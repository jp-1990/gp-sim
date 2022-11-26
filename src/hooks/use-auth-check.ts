import Router from 'next/router';
import { useEffect } from 'react';
import { useAppSelector } from '../store/store';
import { auth } from '../utils/firebase/client';
import { LOGIN_URL } from '../utils/nav';

/**
 * Hook to get current user state, and redirect user if they are not logged in
 */
export const useAuthCheck = () => {
  const currentUser = useAppSelector((state) => state.currentUserSlice);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        Router.push(LOGIN_URL);
      }
    });
    return () => unsub();
  }, []);

  return { currentUser };
};
