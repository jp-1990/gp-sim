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
    defaultMessage:
      'From here you can browse through a list of the liveries contributed by the artists using this platform. If you find a livery you like, you can click on it to view it in more detail. From that page, you will also have the option to add it to your collection. If you are looking to upload your own livery, hit the upload button below!'
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
    defaultMessage: `When uploading a livery, the only things you need to fill in are a title for your livery, the car it belongs to, and the livery files themselves (you will NOT be able to edit the livery files later, so make sure you double check them). Everything else is optional, but if you're making the livery publically available, a description and some images might increase popularity!`
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
    defaultMessage: `Here you can update some of the details for your livery. You cannot update the livery files or the car it belongs to, but more minor or descriptive details can be changed, including the images.`
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
