import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

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

next({});

loadEnvConfig(process.cwd());

window.URL.createObjectURL = jest.fn((file) => `/${file.name}`);

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// Reset any request handlers that we may add during the tests,
beforeEach(() => {
  jest.resetModules();
});
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
});
// Clean up after the tests are finished.
afterAll(() => server.close());

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
