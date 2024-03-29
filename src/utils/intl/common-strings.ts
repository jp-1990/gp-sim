import { defineMessages } from 'react-intl';

// react-intl doesn't like template literals
// scope = `utils.intl.commonStrings`;

const actions = {
  add: {
    id: 'utils.intl.commonStrings.add',
    defaultMessage: 'Add'
  },
  addToBasket: {
    id: 'utils.intl.commonStrings.addToBasket',
    defaultMessage: 'Add to Basket'
  },
  addToCollection: {
    id: 'utils.intl.commonStrings.addToCollection',
    defaultMessage: 'Add to Collection'
  },
  addToGarage: {
    id: 'utils.intl.commonStrings.addToGarage',
    defaultMessage: 'Add to Garage'
  },
  backTo: {
    id: 'utils.intl.commonStrings.backTo',
    defaultMessage: 'Back to {value}'
  },
  cancel: {
    id: 'utils.intl.commonStrings.cancel',
    defaultMessage: 'Cancel'
  },
  change: {
    id: 'utils.intl.commonStrings.change',
    defaultMessage: `Change`
  },
  download: {
    id: 'utils.intl.commonStrings.download',
    defaultMessage: `Download`
  },
  delete: {
    id: 'utils.intl.commonStrings.delete',
    defaultMessage: `Delete`
  },
  editProfile: {
    id: 'utils.intl.commonStrings.editProfile',
    defaultMessage: `Edit Profile`
  },
  edit: {
    id: 'utils.intl.commonStrings.edit',
    defaultMessage: `Edit`
  },
  forgottenPassword: {
    id: 'utils.intl.commonStrings.forgottenPassword',
    defaultMessage: 'Forgotten your password?'
  },
  login: {
    id: 'utils.intl.commonStrings.login',
    defaultMessage: 'Login'
  },
  upload: {
    id: 'utils.intl.commonStrings.upload',
    defaultMessage: 'Upload'
  },
  remove: {
    id: 'utils.intl.commonStrings.remove',
    defaultMessage: 'Remove'
  },
  resetPassword: {
    id: 'utils.intl.commonStrings.resetPassword',
    defaultMessage: 'Reset Password'
  },
  saveChanges: {
    id: 'utils.intl.commonStrings.saveChanges',
    defaultMessage: 'Save Changes'
  },
  selectImages: {
    id: 'utils.intl.commonStrings.selectImages',
    defaultMessage: 'Select Images'
  },
  selectImage: {
    id: 'utils.intl.commonStrings.selectImage',
    defaultMessage: 'Select Image'
  },
  selectFiles: {
    id: 'utils.intl.commonStrings.selectFiles',
    defaultMessage: 'Select Files'
  },
  sendResetPasswordEmail: {
    id: 'utils.intl.commonStrings.sendResetPasswordEmail',
    defaultMessage: 'Send Password Reset Email'
  },
  signUp: {
    id: 'uti.intl.commonStrings.signUp',
    defaultMessage: 'Sign up'
  },
  submit: {
    id: 'uti.intl.commonStrings.submit',
    defaultMessage: 'Submit'
  },
  view: {
    id: 'utils.intl.commonStrings.view',
    defaultMessage: 'View'
  }
};

const download = {
  downloads: {
    id: 'utils.intl.commonStrings.downloads',
    defaultMessage:
      '{downloads, plural, =0 {# Downloads} one {# Download} other {# Downloads}}'
  },
  downloadsLabel: {
    id: 'utils.intl.commonStrings.downloadsLabel',
    defaultMessage: `Downloads`
  }
};

const main = {
  artist: {
    id: 'utils.intl.commonStrings.artist',
    defaultMessage: 'Artist'
  },
  paintshop: {
    id: 'utils.intl.commonStrings.paintshop',
    defaultMessage: 'Paintshop'
  },
  drivers: {
    id: 'utils.intl.commonStrings.drivers',
    defaultMessage: 'Drivers'
  },
  garages: {
    id: 'utils.intl.commonStrings.garages',
    defaultMessage: 'Garages'
  },
  garage: {
    id: 'utils.intl.commonStrings.garages',
    defaultMessage: 'Garage'
  },
  livery: {
    id: 'utils.intl.form.livery',
    defaultMessage: 'Livery'
  },
  liveries: {
    id: 'utils.intl.form.liveres',
    defaultMessage: 'Liveries'
  },
  setups: {
    id: 'utils.intl.commonStrings.setups',
    defaultMessage: 'Setups'
  },
  profile: {
    id: 'utils.intl.commonStrings.profile',
    defaultMessage: 'Profile'
  }
};

const status = {
  uploading: {
    id: 'utils.intl.commonStrings.uploading',
    defaultMessage: 'Uploading'
  },
  loading: {
    id: 'utils.intl.commonStrings.loading',
    defaultMessage: 'Loading'
  },
  error: {
    id: 'utils.intl.commonStrings.error',
    defaultMessage: 'Something went wrong!'
  },
  approved: {
    id: 'utils.intl.commonStrings.approved',
    defaultMessage: 'Approved'
  },
  unauthorized: {
    id: 'utils.intl.commonStrings.unauthorized',
    defaultMessage: 'Unauthorized'
  },
  pleaseLogIn: {
    id: 'utils.intl.commonStrings.pleaseLogIn',
    defaultMessage: 'Please log in to view this content!'
  }
};

const upload = {
  requiredFiles: {
    id: 'utils.intl.commonStrings.requiredFiles',
    defaultMessage: 'Required Files'
  },
  currentlySelected: {
    id: 'utils.intl.commonStrings.currentlySelected',
    defaultMessage: 'Currently Selected'
  }
};

const filters = {
  searchPlaceholder: {
    id: 'utils.intl.commonStrings.searchPlaceholder',
    defaultMessage: 'Search...'
  },
  search: {
    id: 'utils.intl.commonStrings.search',
    defaultMessage: 'Search'
  },
  selectCarPlaceholder: {
    id: 'utils.intl.commonStrings.selectCarPlaceholder',
    defaultMessage: 'Select car'
  },
  selectCar: {
    id: 'utils.intl.commonStrings.selectCar',
    defaultMessage: 'Select car'
  },
  createdAtPlaceholder: {
    id: 'utils.intl.commonStrings.createdAtPlaceholder',
    defaultMessage: 'Created'
  },
  createdAtMostRecent: {
    id: 'utils.intl.commonStrings.createdAtMostRecent',
    defaultMessage: 'Most recent first'
  },
  createdAtOldest: {
    id: 'utils.intl.commonStrings.createdAtOldest',
    defaultMessage: 'Oldest first'
  },
  createdAt: {
    id: 'utils.intl.commonStrings.createdAt',
    defaultMessage: 'Created'
  },
  ratingPlaceholder: {
    id: 'utils.intl.commonStrings.ratingPlaceholder',
    defaultMessage: 'Rating'
  },
  ratingValue: {
    id: 'utils.intl.commonStrings.ratingValue',
    defaultMessage: '{stars} Star'
  },
  rating: {
    id: 'utils.intl.commonStrings.rating',
    defaultMessage: 'Rating'
  },
  minPrice: {
    id: 'utils.intl.commonStrings.minPrice',
    defaultMessage: 'Minimum Price'
  },
  maxPrice: {
    id: 'utils.intl.commonStrings.maxPrice',
    defaultMessage: 'Maximum Price'
  },
  priceSlider: {
    id: 'utils.intl.commonStrings.priceSlider',
    defaultMessage: 'Price Slider'
  }
};

export const commonStrings = defineMessages({
  ...actions,
  ...download,
  ...filters,
  ...main,
  ...status,
  ...upload
});
