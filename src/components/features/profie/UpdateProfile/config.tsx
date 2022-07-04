import { validatorOptions } from '../../../shared/Form/utils';

export const stateKeys = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
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
  firstName: undefined,
  lastName: undefined,
  email: [validatorOptions.NON_NULL_STRING, validatorOptions.EMAIL],
  displayName: [validatorOptions.NON_NULL_STRING],
  imageFiles: undefined
};
