import fs from 'fs';
import React, { useMemo } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { ChakraProvider } from '@chakra-ui/react';
import { UserProvider } from '@auth0/nextjs-auth0';
import { configureStore, Store } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { storeConfig } from '../../store/store';
import theme from '../../styles/chakra-theme';

import English from '../../../lang/en.json';
import French from '../../../lang/fr.json';
import {
  CAR_SLICE_NAME,
  initialState as initialCarState
} from '../../store/car/slice';
import {
  LIVERY_SLICE_NAME,
  initialState as initialLiveryState
} from '../../store/livery/slice';

import { CarDataType, CarsDataType } from '../../types';

interface Auth0User {
  name?: string;
  nickname?: string;
  picture?: string;
  sub?: string;
  updated_at?: string;
}
const testUser: Record<'user', Auth0User | undefined> = {
  user: {
    name: 'test-name',
    nickname: 'test-nickname',
    picture: 'test-image-url',
    sub: 'test-sub',
    updated_at: 'test-updated-at'
  }
};
jest.mock('@auth0/nextjs-auth0', () => ({
  UserProvider: ({ children }: any) => <>{children}</>,
  withAuthenticationRequired: (component: any, _: any) => component,
  useUser: () => {
    return {
      isLoading: false,
      user: testUser.user,
      isAuthenticated: true,
      loginWithRedirect: jest.fn()
    };
  }
}));
export const setTestUser = (user: Auth0User | undefined) =>
  (testUser.user = user);

const carData = fs.readFileSync('src/utils/dev-data/cars.json', 'utf-8');
const cars = JSON.parse(carData) as CarsDataType;

const defaultPreloadedState = {
  [CAR_SLICE_NAME]: {
    ...initialCarState,
    ...cars.reduce(
      (acc, curr, i) => {
        const prev = { ...acc };
        prev.ids.push(`${i}`);
        prev.entities[`${i}`] = curr;
        return prev;
      },
      { ids: [], entities: {} } as {
        ids: string[];
        entities: Record<string, CarDataType>;
      }
    )
  },
  [LIVERY_SLICE_NAME]: {
    ...initialLiveryState
  }
};

interface Props {
  locale?: string;
  preloadedState?: Record<string, any>;
  testStore: Store;
}
const TestProviders: React.FC<Props> = ({
  locale = 'en',
  preloadedState = defaultPreloadedState,
  testStore = configureStore({ ...storeConfig, preloadedState }),
  children
}) => {
  const messages = useMemo(() => {
    switch (locale) {
      case 'en':
        return English;
      case 'fr':
        return French;
      default:
        return English;
    }
  }, [locale]);

  return (
    <Provider store={testStore}>
      <UserProvider>
        <ChakraProvider theme={theme}>
          <IntlProvider
            messages={messages}
            locale={locale}
            defaultLocale={'en'}
          >
            {children}
          </IntlProvider>
        </ChakraProvider>
      </UserProvider>
    </Provider>
  );
};

interface CustomRenderOptions {
  testProviderProps?: Props;
  testingLibraryOptions?: Omit<RenderOptions, 'wrapper'>;
}
export const customRender = (
  ui: React.ReactElement,
  options?: CustomRenderOptions
) => {
  return render(ui, {
    wrapper: (props: any) => (
      <TestProviders {...props} {...options?.testProviderProps} />
    ),
    ...options?.testingLibraryOptions
  });
};

export * from '@testing-library/react';
export { customRender as render };
