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
    defaultMessage: `Garages represent a way to organise your liveries. 'Your Collection' includes any liveries you've chosen to add to your collection, as well as any liveries you've uploaded. You can also select other garages that you belong to, and view the liveries added to that garage by other members. If you want to start your own garage, or if you've been given a key to join a garage, use the buttons below!`
  },
  joinGarage: {
    id: 'utils.intl.garages.joinGarage',
    defaultMessage: `Join Garage`
  },
  leaveGarage: {
    id: 'utils.intl.garages.leaveGarage',
    defaultMessage: `Leave Garage`
  },
  yourCollection: {
    id: 'utils.intl.garages.yourCollection',
    defaultMessage: `Your Collection`
  },
  yourCollectionDescription: {
    id: 'utils.intl.garages.yourCollectionDescription',
    defaultMessage: `This collection is unique to you. No one else can view it, and it contains all the liveries that you've added to your collection, as well as any that you've uploaded, both public and private.`
  }
};

const create = {
  createHeading: {
    id: 'utils.intl.garages.createHeading',
    defaultMessage: `Create a Garage`
  },
  createSummary: {
    id: 'utils.intl.garages.createSummary',
    defaultMessage: `Once created, you can go to your profile and edit the garage details there. From the edit page you will be able to manage the liveries and drivers that belong to the garage, and see the garage key. In order to invite new drivers to the garage you will need to provide them with this key, which they can use on the main 'garages' page to join this garage.`
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
    defaultMessage: `Edit Garage`
  },
  garageKeyInfo: {
    id: 'utils.intl.garages.garageKeyInfo',
    defaultMessage:
      'You will need to give your garage key to drivers to allow them to join.'
  },
  garageKey: {
    id: 'utils.intl.garages.garageKey',
    defaultMessage: 'Garage Key: {key}'
  },
  updateAGarage: {
    id: 'utils.intl.garages.updateAGarage',
    defaultMessage: 'Edit a Garage'
  },
  updateGarage: {
    id: 'utils.intl.garages.updateGarage',
    defaultMessage: 'Save Changes'
  },
  deleteItemAreYouSure: {
    id: 'utils.intl.liveries.deleteItemAreYouSure',
    defaultMessage: `Are you sure you want to delete these { item }?`
  },
  leaveGarageAreYouSure: {
    id: 'utils.intl.liveries.leaveGarageAreYouSure',
    defaultMessage: `Are you sure you want to leave this garage?`
  }
};

export const garageStrings = defineMessages({
  ...garages,
  ...create,
  ...edit
});
