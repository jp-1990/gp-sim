import fs from 'fs';
import React, { useMemo } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { ChakraProvider } from '@chakra-ui/react';
import { configureStore, Store } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { apiSlice, storeConfig } from '../../store/store';
import theme from '../../styles/chakra-theme';

import English from '../../../lang/en.json';
import French from '../../../lang/fr.json';

import { CarDataType, CarsDataType } from '../../types';

interface Auth0User {
  name?: string;
  nickname?: string;
  picture?: string;
  sub?: string;
  updated_at?: string;
}
const testUser: Record<'user', undefined> = { user: undefined };

export const setTestUser = (user: undefined) => (testUser.user = user);

const carData = fs.readFileSync('src/utils/dev-data/cars.json', 'utf-8');
const cars = JSON.parse(carData) as CarsDataType;

const defaultPreloadedState = {
  api: {
    queries: {
      'getCars(undefined)': {
        status: 'fulfilled',
        endpointName: 'getCars',
        requestId: 'HqeJivaMUHLfCw6zDHfwP',
        startedTimeStamp: new Date(Date.now()).valueOf() - 200,
        data: {
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
        fulfilledTimeStamp: new Date(Date.now()).valueOf()
      }
    },
    mutations: {},
    provided: {},
    subscriptions: {},
    config: {
      online: true,
      focused: true,
      middlewareRegistered: true,
      refetchOnFocus: false,
      refetchOnReconnect: false,
      refetchOnMountOrArgChange: false,
      keepUnusedDataFor: 60,
      reducerPath: 'api'
    }
  }
};

interface Props {
  locale?: string;
  preloadedState?: Record<string, any>;
  testStore: Store;
  children: React.ReactNode;
}
const TestProviders: React.FC<Props> = ({
  locale = 'en',
  preloadedState = defaultPreloadedState,
  testStore = configureStore({
    ...storeConfig,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware)
  }),
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
      <ChakraProvider theme={theme}>
        <IntlProvider messages={messages} locale={locale} defaultLocale={'en'}>
          {children}
        </IntlProvider>
      </ChakraProvider>
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
