import { m } from 'framer-motion';
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
  creator: {
    id: 'utils.intl.form.creator',
    defaultMessage: 'Creator'
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
  image: {
    id: 'utils.intl.form.image',
    defaultMessage: 'Image'
  },
  price: {
    id: 'utils.intl.form.price',
    defaultMessage: 'Price'
  },
  searchTags: {
    id: 'utils.intl.form.searchTags',
    defaultMessage: 'Search Tags'
  },
  firstName: {
    id: 'utils.intl.form.firstName',
    defaultMessage: 'First Name'
  },
  lastName: {
    id: 'utils.intl.form.lastName',
    defaultMessage: 'Last Name'
  },
  email: {
    id: 'utils.intl.form.email',
    defaultMessage: 'Email'
  },
  displayName: {
    id: 'utils.intl.form.displayName',
    defaultMessage: 'Display Name'
  }
};

const fieldPlaceholders = {
  titlePlaceholder: {
    id: 'utils.intl.form.titlePlaceholder',
    defaultMessage: 'Title'
  },
  descriptionPlaceholder: {
    id: 'utils.intl.liveries.descriptionPlaceholder',
    defaultMessage: 'Tell people about this {item}...'
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
    id: 'utils.intl.form.invalidLiveryFiles',
    defaultMessage: 'The following files are missing: {files}'
  },
  invalidDynamicLiveryFileName: {
    id: 'utils.intl.form.invalidDynamicLiveryFileName',
    defaultMessage:
      '[your-livery-name].json can only contain letters, numbers, -, _ and space. It must be in json format.'
  },
  invalidEmailFormat: {
    id: 'utils.intl.form.invalidEmailFormat',
    defaultMessage: 'This email format is invalid'
  }
};

const helperText = {
  selectLiveryImagesHelperText: {
    id: 'utils.intl.form.selectLiveryImagesHelperText',
    defaultMessage: 'Add up to 4 images of your livery*'
  },
  selectGarageImageHelperText: {
    id: 'utils.intl.form.selectGarageImageHelperText',
    defaultMessage: 'Add an image for your garage*'
  },
  selectProfileImageHelperText: {
    id: 'utils.intl.form.selectProfileImageHelperText',
    defaultMessage: 'Add an image for your profile*'
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

const result = {
  createSuccess: {
    id: 'utils.intl.form.createSuccess',
    defaultMessage: '{item} successfully created'
  },
  createError: {
    id: 'utils.intl.form.createError',
    defaultMessage:
      "We're sorry, something went wrong when creating your {item}"
  }
};

export const formStrings = defineMessages({
  ...fieldLabels,
  ...fieldPlaceholders,
  ...helperText,
  ...invalidField,
  ...liveries,
  ...result
});
