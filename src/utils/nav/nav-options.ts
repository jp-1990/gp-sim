import { IntlShape } from 'react-intl';
import { commonStrings } from '../intl';
import { LIVERIES_URL, GARAGES_URL } from './paths';

export const navOptions = (intl: IntlShape) => [
  {
    label: intl.formatMessage(commonStrings.paintshop),
    requiresUser: false,
    path: LIVERIES_URL
  },
  //   { label: intl.formatMessage(commonStrings.setups), requiresUser: false, path:'/setups' },
  {
    label: intl.formatMessage(commonStrings.garages),
    requiresUser: false,
    path: GARAGES_URL
  }
];
