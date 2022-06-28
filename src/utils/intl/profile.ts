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
  },
  profileHeading: {
    id: 'utils.intl.profile.profileHeading',
    defaultMessage: `Profile`
  },
  profileSummary: {
    id: 'utils.intl.profile.profileSummary',
    defaultMessage: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mauris eros, euismod ut mi vitae, convallis iaculis quam. Pellentesque consectetur iaculis tortor vitae euismod. Integer malesuada congue elementum. Pellentesque vulputate diam dignissim elit hendrerit iaculis. Interdum et malesuada fames ac ante ipsum primis in faucibus`
  }
};

export const profileStrings = defineMessages({
  ...profile
});
