import { validatorOptions } from '../../../shared/Form/utils';

export const stateKeys = {
  ABOUT: 'about',
  FORENAME: 'forename',
  SURNAME: 'surname',
  EMAIL: 'email',
  DISPLAY_NAME: 'displayName',
  IMAGE_FILES: 'imageFiles'
} as const;

export const initialState = {
  error: false,
  invalidFields: [],
  loading: false,
  [stateKeys.IMAGE_FILES]: []
};

export const validators = {
  [stateKeys.ABOUT]: undefined,
  [stateKeys.FORENAME]: undefined,
  [stateKeys.SURNAME]: undefined,
  [stateKeys.EMAIL]: [validatorOptions.NON_NULL_STRING, validatorOptions.EMAIL],
  [stateKeys.DISPLAY_NAME]: [validatorOptions.NON_NULL_STRING],
  [stateKeys.IMAGE_FILES]: undefined
};
