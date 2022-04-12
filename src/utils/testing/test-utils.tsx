import React, { useMemo } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { ChakraProvider } from '@chakra-ui/react';
import { UserProvider } from '@auth0/nextjs-auth0';
import { Provider } from 'react-redux';

import store from '../../store/store';
import theme from '../../styles/chakra-theme';

import English from '../../../lang/en.json';
import French from '../../../lang/fr.json';
import { AnyAction, Store } from '@reduxjs/toolkit';

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

interface Props {
  locale: string;
  reduxStore: Store<any, AnyAction>;
}
const TestProviders: React.FC<Props> = ({
  children,
  reduxStore = store,
  locale = 'en'
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
    <Provider store={reduxStore}>
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
  testProviderProps: Props;
  testingLibraryOptions: Omit<RenderOptions, 'wrapper'>;
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
