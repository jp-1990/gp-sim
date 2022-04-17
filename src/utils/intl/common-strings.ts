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
  upload: {
    id: 'utils.intl.commonStrings.upload',
    defaultMessage: 'Upload'
  },
  cancel: {
    id: 'utils.intl.commonStrings.cancel',
    defaultMessage: 'Cancel'
  },
  remove: {
    id: 'utils.intl.commonStrings.remove',
    defaultMessage: 'Remove'
  },
  selectImages: {
    id: 'utils.intl.commonStrings.selectImages',
    defaultMessage: 'Select Images'
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
  setups: {
    id: 'utils.intl.commonStrings.setups',
    defaultMessage: 'Setups'
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
  }
};

const upload = {};

export const commonStrings = defineMessages({
  ...actions,
  ...download,
  ...main,
  ...status,
  ...upload
});
