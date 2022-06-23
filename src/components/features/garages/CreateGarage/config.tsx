import { FormattedMessage } from 'react-intl';
import { commonStrings, garageStrings } from '../../../../utils/intl';
import { GARAGES_URL } from '../../../../utils/nav';
import { validatorOptions } from '../../../shared/Form/utils';

export const breadcrumbOptions = [
  {
    name: <FormattedMessage {...commonStrings.garages} />,
    href: GARAGES_URL
  },
  {
    name: <FormattedMessage {...garageStrings.createAGarage} />,
    href: undefined
  }
];
export const stateKeys = {
  TITLE: 'title',
  DESCRIPTION: 'description',
  IMAGE_FILES: 'imageFiles'
} as const;

export const initialState = {
  error: false,
  invalidFields: [],
  loading: false,
  [stateKeys.IMAGE_FILES]: []
};

export const validators = {
  title: [validatorOptions.NON_NULL_STRING],
  description: undefined,
  imageFiles: undefined
};
