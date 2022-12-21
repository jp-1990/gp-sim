import '@fontsource/lato';

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { IntlProvider } from 'react-intl';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { ChakraProvider } from '@chakra-ui/react';

import { useAppDispatch, wrapper } from '../store/store';
import theme from '../styles/chakra-theme';

import English from '../../lang/en.json';
import French from '../../lang/fr.json';

import { auth } from '../utils/firebase/client';
import { actions, thunks } from '../store/user/slice';

if (process.env.NEXT_PUBLIC_ENABLE_MSW === 'true') {
  require('../msw');
}

function MyApp({ Component, pageProps }: AppProps) {
  const { locale, defaultLocale } = useRouter();
  const dispatch = useAppDispatch();

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

  // listen for auth token changes, update current user slice
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        dispatch(actions.setToken(token));
        await dispatch(thunks.getCurrentUser());
      }
    });
    return () => unsub();
  }, [dispatch]);

  return (
    <IntlProvider
      messages={messages}
      locale={locale || 'en'}
      defaultLocale={defaultLocale}
    >
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </IntlProvider>
  );
}

export default wrapper.withRedux(MyApp);
