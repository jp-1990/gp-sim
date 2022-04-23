import { defineMessages } from 'react-intl';

// react-intl doesn't like template literals
// scope = `utils.intl.form`;

const fieldLabels = {
  title: {
    id: 'utils.intl.form.title',
    defaultMessage: 'Title'
  },
  car: {
    id: 'utils.intl.form.car',
    defaultMessage: 'Car'
  },
  description: {
    id: 'utils.intl.form.description',
    defaultMessage: 'Description'
  },
  garage: {
    id: 'utils.intl.form.garage',
    defaultMessage: 'Garage'
  },
  garageKey: {
    id: 'utils.intl.form.garageKey',
    defaultMessage: 'Garage Key'
  },
  price: {
    id: 'utils.intl.form.price',
    defaultMessage: 'Price'
  },
  searchTags: {
    id: 'utils.intl.form.searchTags',
    defaultMessage: 'Search Tags'
  }
};

const fieldPlaceholders = {
  titlePlaceholder: {
    id: 'utils.intl.form.titlePlaceholder',
    defaultMessage: 'Title'
  },
  carPlaceholder: {
    id: 'utils.intl.form.carPlaceholder',
    defaultMessage: 'Select a car'
  },
  garagePlaceholder: {
    id: 'utils.intl.form.garagePlaceholder',
    defaultMessage: 'Select a garage'
  },
  garageKeyPlaceholder: {
    id: 'utils.intl.form.garageKeyPlaceholder',
    defaultMessage: 'Garage Key'
  },
  searchTagsPlaceholder: {
    id: 'utils.intl.form.searchTagsPlaceholder',
    defaultMessage: 'Search tags'
  },
  pricePlaceholder: {
    id: 'utils.intl.form.pricePlaceholder',
    defaultMessage: 'Free'
  }
};

const liveries = {
  makeThisLiveryPublic: {
    id: 'utils.intl.form.makeThisLiveryPublic',
    defaultMessage: 'Make this livery public'
  },
  addThisLiveryToAPrivateGarage: {
    id: 'utils.intl.form.addThisLiveryToAPrivateGarage',
    defaultMessage: 'Add this livery to a private garage'
  },
  selectLiveryFiles: {
    id: 'utils.intl.form.selectLiveryFiles',
    defaultMessage: 'Select Livery Files'
  }
};

const invalidField = {
  invalidInput: {
    id: 'utils.intl.form.invalidInput',
    defaultMessage: 'Invalid input'
  },
  fieldNull: {
    id: 'utils.intl.form.fieldNull',
    defaultMessage: 'This field is required'
  },
  invalidLiveryFiles: {
    id: 'utils.intl.form.fieldNull',
    defaultMessage: 'The following files are missing: {files}'
  },
  invalidDynamicLiveryFileName: {
    id: 'utils.intl.form.fieldNull',
    defaultMessage:
      '[your-livery-name].json can only contain letters, numbers, -, _ and space. It must be in json format.'
  }
};

const helperText = {
  selectImageHelperText: {
    id: 'utils.intl.form.selectImageHelperText',
    defaultMessage: 'Add up to 4 images of your livery*'
  },
  selectLiveryFilesHelperText: {
    id: 'utils.intl.form.selectLiveryFilesHelperText',
    defaultMessage:
      'It is your responsibility to ensure that the correct files are selected*'
  },
  searchTagsHelperText: {
    id: 'utils.intl.form.searchTagsHelperText',
    defaultMessage: 'Enter a comma after each search tag*'
  }
};

export const formStrings = defineMessages({
  ...fieldLabels,
  ...fieldPlaceholders,
  ...helperText,
  ...invalidField,
  ...liveries
});
