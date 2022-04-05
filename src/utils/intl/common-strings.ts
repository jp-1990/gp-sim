import { defineMessages } from 'react-intl';

// react-intl doesn't like template literals
// scope = `utils.intl.commonStrings`;

export const commonStrings = defineMessages({
  paintshop: {
    id: 'utils.intl.commonStrings.paintshop',
    defaultMessage: 'Paintshop'
  },
  garages: {
    id: 'utils.intl.commonStrings.garages',
    defaultMessage: 'Garages'
  },
  setups: {
    id: 'utils.intl.commonStrings.setups',
    defaultMessage: 'Setups'
  },
  // PROFILE
  profile: {
    id: 'utils.intl.commonStrings.profile',
    defaultMessage: 'Profile'
  },
  viewProfile: {
    id: 'utils.intl.commonStrings.viewProfile',
    defaultMessage: 'View profile'
  },
  myGarages: {
    id: 'utils.intl.commonStrings.myGarages',
    defaultMessage: 'My garages'
  },
  mySetups: {
    id: 'utils.intl.commonStrings.mySetups',
    defaultMessage: 'My setups'
  },
  myLiveries: {
    id: 'utils.intl.commonStrings.myLiveries',
    defaultMessage: 'My liveries'
  }
});
