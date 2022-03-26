import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { IntlProvider } from 'react-intl';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import English from '../../lang/en.json';
import French from '../../lang/fr.json';

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
    <IntlProvider
      messages={messages}
      locale={locale || 'en'}
      defaultLocale={defaultLocale}
    >
      <Component {...pageProps} />;
    </IntlProvider>
  );
}

export default MyApp;
