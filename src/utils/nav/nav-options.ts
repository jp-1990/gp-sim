import { IntlShape } from 'react-intl';
import { commonStrings } from '../intl';
import { LIVERIES_URL, GARAGES_URL } from './paths';

export const navOptions = (intl: IntlShape) => [
  {
    label: intl.formatMessage(commonStrings.paintshop),
    requiresUser: false,
    path: LIVERIES_URL
  },
  {
    label: intl.formatMessage(commonStrings.garages),
    requiresUser: true,
    path: GARAGES_URL
  }
];
