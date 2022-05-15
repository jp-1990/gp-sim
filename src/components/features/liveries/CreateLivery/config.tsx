import { FormattedMessage } from 'react-intl';
import { commonStrings, liveryStrings } from '../../../../utils/intl';
import { LIVERIES_URL } from '../../../../utils/nav';
import { validatorOptions } from '../../../shared/Form/utils';

export const breadcrumbOptions = [
  {
    name: <FormattedMessage {...commonStrings.paintshop} />,
    href: LIVERIES_URL
  },
  {
    name: <FormattedMessage {...liveryStrings.uploadALivery} />,
    href: undefined
  }
];

export const stateKeys = {
  TITLE: 'title',
  CAR: 'car',
  DESCRIPTION: 'description',
  LIVERY_FILES: 'liveryFiles',
  PUBLIC_LIVERY: 'publicLivery',
  PRIVATE_GARAGE: 'privateGarage',
  GARAGE: 'garage',
  GARAGE_KEY: 'garageKey',
  PRICE: 'price',
  SEARCH_TAGS: 'searchTags',
  IMAGE_FILES: 'imageFiles'
} as const;

export const initialState = {
  error: false,
  invalidFields: [],
  loading: false,
  [stateKeys.CAR]: '',
  [stateKeys.IMAGE_FILES]: [],
  [stateKeys.LIVERY_FILES]: [],
  [stateKeys.PRICE]: 'Free',
  [stateKeys.PUBLIC_LIVERY]: true,
  [stateKeys.SEARCH_TAGS]: ''
};

export const validators = {
  title: [validatorOptions.NON_NULL_STRING],
  car: [validatorOptions.NON_NULL_STRING],
  description: undefined,
  liveryFiles: [
    validatorOptions.NON_NULL_LIVERY_FILES,
    validatorOptions.DYNAMIC_LIVERY_FILE_NAME
  ],
  publicLivery: undefined,
  privateGarage: undefined,
  garage: undefined,
  garageKey: undefined,
  price: undefined,
  searchTags: undefined,
  imageFiles: undefined
};
