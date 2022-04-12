import { IntlShape } from 'react-intl';
import { commonStrings } from '../intl';

export const navOptions = (intl: IntlShape) => [
  {
    label: intl.formatMessage(commonStrings.paintshop),
    requiresUser: false,
    path: '/liveries'
  },
  //   { label: intl.formatMessage(commonStrings.setups), requiresUser: false, path:'/setups' },
  {
    label: intl.formatMessage(commonStrings.garages),
    requiresUser: true,
    path: '/garages'
  }
];
