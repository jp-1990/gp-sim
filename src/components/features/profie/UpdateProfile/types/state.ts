import { stateKeys } from '../config';

type UpdateProfileFormImageFiles = Array<File>;

export interface UpdateProfileFormStateType {
  [stateKeys.ABOUT]?: string;
  [stateKeys.FORENAME]?: string;
  [stateKeys.SURNAME]?: string;
  [stateKeys.EMAIL]: string;
  [stateKeys.DISPLAY_NAME]: string;
  [stateKeys.IMAGE_FILES]?: UpdateProfileFormImageFiles;
}
