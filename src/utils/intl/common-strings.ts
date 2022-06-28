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
  download: {
    id: 'utils.intl.commonStrings.download',
    defaultMessage: `Download`
  },
  upload: {
    id: 'utils.intl.commonStrings.upload',
    defaultMessage: 'Upload'
  },
  remove: {
    id: 'utils.intl.commonStrings.remove',
    defaultMessage: 'Remove'
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
  view: {
    id: 'utils.intl.commonStrings.view',
    defaultMessage: 'View'
  }
};

const download = {
  downloads: {
    id: 'utils.intl.commonStrings.downloads',
    defaultMessage: `{downloads} Downloads`
  }
};

const main = {
  paintshop: {
    id: 'utils.intl.commonStrings.paintshop',
    defaultMessage: 'Paintshop'
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
  error: {
    id: 'utils.intl.commonStrings.error',
    defaultMessage: 'Something went wrong!'
  },
  approved: {
    id: 'utils.intl.commonStrings.approved',
    defaultMessage: 'Approved'
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
  selectCarPlaceholder: {
    id: 'utils.intl.commonStrings.selectCarPlaceholder',
    defaultMessage: 'Select car'
  },
  createdAtPlaceholder: {
    id: 'utils.intl.commonStrings.createdAtPlaceholder',
    defaultMessage: 'Created'
  },
  ratingPlaceholder: {
    id: 'utils.intl.commonStrings.ratingPlaceholder',
    defaultMessage: 'Rating'
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
