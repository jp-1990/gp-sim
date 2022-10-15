import { defineMessages } from 'react-intl';

// react-intl doesn't like template literals
// scope = `utils.intl.commonStrings`;

const actions = {
  addToBasket: {
    id: 'utils.intl.commonStrings.addToBasket',
    defaultMessage: 'Add to Basket'
  },
  addToCollection: {
    id: 'utils.intl.commonStrings.addToCollection',
    defaultMessage: 'Add to Collection'
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
  signUp: {
    id: 'uti.intl.commonStrings.signUp',
    defaultMessage: 'Sign up'
  },
  view: {
    id: 'utils.intl.commonStrings.view',
    defaultMessage: 'View'
  }
};

const download = {
  downloads: {
    id: 'utils.intl.commonStrings.downloads',
    defaultMessage: `{downloads} Downloads`
  },
  downloadsLabel: {
    id: 'utils.intl.commonStrings.downloadsLabel',
    defaultMessage: `Downloads`
  }
};

const main = {
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
