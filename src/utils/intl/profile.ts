import { defineMessages } from 'react-intl';

// react-intl doesn't like template literals
// scope = `utils.intl.profile`;

const profile = {
  profile: {
    id: 'utils.intl.profile.profile',
    defaultMessage: 'Profile'
  },
  viewProfile: {
    id: 'utils.intl.profile.viewProfile',
    defaultMessage: 'View profile'
  },
  myGarages: {
    id: 'utils.intl.profile.myGarages',
    defaultMessage: 'My garages'
  },
  mySetups: {
    id: 'utils.intl.profile.mySetups',
    defaultMessage: 'My setups'
  },
  myLiveries: {
    id: 'utils.intl.profile.myLiveries',
    defaultMessage: 'My liveries'
  }
};

export const profileStrings = defineMessages({
  ...profile
});
