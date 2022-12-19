import '@testing-library/jest-dom';
import { testServer } from './src/msw/server';

import next from 'next';
import { loadEnvConfig } from '@next/env';

import 'firebase/app';
import 'firebase/auth';

jest.mock('firebase/app', () => {
  return {
    initializeApp: jest.fn()
  };
});
jest.mock('firebase/auth', () => {
  return {
    getAuth: () => {
      return {
        onAuthStateChanged: () => jest.fn()
      };
    },
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn()
  };
});

jest.mock('src/lib/car.ts');
jest.mock('src/lib/user.ts');
jest.mock('src/lib/livery.ts');
jest.mock('src/lib/garage.ts');

next({});

loadEnvConfig(process.cwd());

window.URL.createObjectURL = jest.fn((file) => `/${file.name}`);

// Establish API mocking before all tests.
beforeAll(() => testServer.listen({ onUnhandledRequest: 'error' }));
// Reset any request handlers that we may add during the tests,
beforeEach(() => {
  jest.resetModules();
});
// so they don't affect other tests.
afterEach(() => {
  testServer.resetHandlers();
});
// Clean up after the tests are finished.
afterAll(() => testServer.close());

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

window.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));
