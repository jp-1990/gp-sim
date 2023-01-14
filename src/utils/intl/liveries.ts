import { defineMessages } from 'react-intl';

// react-intl doesn't like template literals
// scope = `utils.intl.liveries`;

const liveries = {
  liveriesHeading: {
    id: 'utils.intl.liveries.liveriesHeading',
    defaultMessage: `Paintshop`
  },
  liveriesSummary: {
    id: 'utils.intl.liveries.liveriesSummary',
    defaultMessage: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mauris eros, euismod ut mi vitae, convallis iaculis quam. Pellentesque consectetur iaculis tortor vitae euismod. Integer malesuada congue elementum. Pellentesque vulputate diam dignissim elit hendrerit iaculis. Interdum et malesuada fames ac ante ipsum primis in faucibus`
  },
  inColletion: {
    id: 'utils.intl.liveries.inColletion',
    defaultMessage: `This livery is in your collection`
  }
};

const upload = {
  uploadHeading: {
    id: 'utils.intl.liveries.uploadHeading',
    defaultMessage: `Upload a Livery`
  },
  uploadSummary: {
    id: 'utils.intl.liveries.uploadSummary',
    defaultMessage: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mauris eros, euismod ut mi vitae, convallis iaculis quam. Pellentesque consectetur iaculis tortor vitae euismod. Integer malesuada congue elementum. Pellentesque vulputate diam dignissim elit hendrerit iaculis.`
  },
  uploadALivery: {
    id: 'utils.intl.liveries.uploadALivery',
    defaultMessage: 'Upload a Livery'
  },
  uploadLivery: {
    id: 'utils.intl.liveries.uploadLivery',
    defaultMessage: 'Upload Livery'
  },
  descriptionPlaceholder: {
    id: 'utils.intl.liveries.descriptionPlaceholder',
    defaultMessage: 'Tell people about this livery...'
  }
};

const update = {
  updateHeading: {
    id: 'utils.intl.liveries.updateHeading',
    defaultMessage: `Update a Livery`
  },
  updateSummary: {
    id: 'utils.intl.liveries.updateSummary',
    defaultMessage: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mauris eros, euismod ut mi vitae, convallis iaculis quam. Pellentesque consectetur iaculis tortor vitae euismod. Integer malesuada congue elementum. Pellentesque vulputate diam dignissim elit hendrerit iaculis.`
  },
  updateALivery: {
    id: 'utils.intl.liveries.updateALivery',
    defaultMessage: 'Update a Livery'
  },
  updateLivery: {
    id: 'utils.intl.liveries.updateLivery',
    defaultMessage: 'Update Livery'
  }
};

export const liveryStrings = defineMessages({
  ...liveries,
  ...upload,
  ...update
});
