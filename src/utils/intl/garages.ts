import { defineMessages } from 'react-intl';

// react-intl doesn't like template literals
// scope = `utils.intl.garages`;

const garages = {
  garagesHeading: {
    id: 'utils.intl.garages.garagesHeading',
    defaultMessage: `Garages`
  },
  garagesSummary: {
    id: 'utils.intl.garages.garagesSummary',
    defaultMessage: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mauris eros, euismod ut mi vitae, convallis iaculis quam. Pellentesque consectetur iaculis tortor vitae euismod. Integer malesuada congue elementum. Pellentesque vulputate diam dignissim elit hendrerit iaculis. Interdum et malesuada fames ac ante ipsum primis in faucibus`
  },
  yourCollection: {
    id: 'utils.intl.garages.yourCollection',
    defaultMessage: `Your Collection`
  },
  yourCollectionDescription: {
    id: 'utils.intl.garages.yourCollectionDescription',
    defaultMessage: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mauris eros, euismod ut mi vitae, convallis iaculis quam. Pellentesque consectetur iaculis tortor vitae euismod. Integer malesuada congue elementum. Pellentesque vulputate diam dignissim elit hendrerit iaculis.`
  }
};

const create = {
  createHeading: {
    id: 'utils.intl.garages.createHeading',
    defaultMessage: `Create a Garage`
  },
  createSummary: {
    id: 'utils.intl.garages.createSummary',
    defaultMessage: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mauris eros, euismod ut mi vitae, convallis iaculis quam. Pellentesque consectetur iaculis tortor vitae euismod. Integer malesuada congue elementum. Pellentesque vulputate diam dignissim elit hendrerit iaculis.`
  },
  createAGarage: {
    id: 'utils.intl.garages.createAGarage',
    defaultMessage: 'Create a Garage'
  },
  createGarage: {
    id: 'utils.intl.garages.createGarage',
    defaultMessage: 'Create Garage'
  },
  descriptionPlaceholder: {
    id: 'utils.intl.garages.descriptionPlaceholder',
    defaultMessage: 'Tell people about this Garage...'
  }
};

const edit = {
  updateHeading: {
    id: 'utils.intl.garages.updateHeading',
    defaultMessage: `Edit a Garage`
  },
  updateSummary: {
    id: 'utils.intl.garages.updateSummary',
    defaultMessage: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mauris eros, euismod ut mi vitae, convallis iaculis quam. Pellentesque consectetur iaculis tortor vitae euismod. Integer malesuada congue elementum. Pellentesque vulputate diam dignissim elit hendrerit iaculis.`
  },
  updateAGarage: {
    id: 'utils.intl.garages.updateAGarage',
    defaultMessage: 'Edit a Garage'
  },
  updateGarage: {
    id: 'utils.intl.garages.updateGarage',
    defaultMessage: 'Save Changes'
  }
};

export const garageStrings = defineMessages({
  ...garages,
  ...create,
  ...edit
});
