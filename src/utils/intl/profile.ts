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
  noLiveries: {
    id: 'utils.intl.profile.noLiveries',
    defaultMessage: 'This user has not uploaded any liveries'
  },
  profileHeading: {
    id: 'utils.intl.profile.profileHeading',
    defaultMessage: `Profile`
  },
  profileSummary: {
    id: 'utils.intl.profile.profileSummary',
    defaultMessage: `From here you can edit your profile details. You can also manage liveries and garages that you have created. You have the option to edit them or delete them at any time.`
  },
  deleteItem: {
    id: 'utils.intl.liveries.deleteItem',
    defaultMessage: `Delete {item}`
  },
  deleteItemAreYouSure: {
    id: 'utils.intl.liveries.deleteItemAreYouSure',
    defaultMessage: `Are you sure you want to delete this { item }?`
  }
};

export const profileStrings = defineMessages({
  ...profile
});
