import { defineMessages } from 'react-intl';

// react-intl doesn't like template literals
// scope = `components.layout.MainLayout`;

export const messages = defineMessages({
  login: {
    id: 'components.layout.MainLayout.login',
    defaultMessage: 'Log in'
  },
  logout: {
    id: 'components.layout.MainLayout.logout',
    defaultMessage: 'Log out'
  }
});
