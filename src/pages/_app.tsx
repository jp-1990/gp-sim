import '@fontsource/lato';

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0';
import { IntlProvider } from 'react-intl';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';

import store from '../store/store';
import theme from '../styles/chakra-theme';

import English from '../../lang/en.json';
import French from '../../lang/fr.json';

if (process.env.NODE_ENV === 'development') {
  require('../mocks');
}

function MyApp({ Component, pageProps }: AppProps) {
  const { locale, defaultLocale } = useRouter();

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
    <Provider store={store}>
      <UserProvider>
        <IntlProvider
          messages={messages}
          locale={locale || 'en'}
          defaultLocale={defaultLocale}
        >
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </IntlProvider>
      </UserProvider>
    </Provider>
  );
}

export default MyApp;
