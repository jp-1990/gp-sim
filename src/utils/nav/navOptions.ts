import { IntlShape } from 'react-intl';
import { commonStrings } from '../intl';

export const navOptions = (intl: IntlShape) => [
  { label: intl.formatMessage(commonStrings.paintshop), requiresUser: false },
  //   { label: intl.formatMessage(commonStrings.setups), requiresUser: false },
  { label: intl.formatMessage(commonStrings.garages), requiresUser: true }
];
