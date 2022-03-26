import React, { useMemo } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import English from '../../../lang/en.json';
import French from '../../../lang/fr.json';

interface Props {
  locale: string;
}
const TestProviders: React.FC<Props> = ({ children, locale = 'en' }) => {
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
    <IntlProvider messages={messages} locale={locale} defaultLocale={'en'}>
      {children}
    </IntlProvider>
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
