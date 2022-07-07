import { stateKeys } from '../config';

type UpdateProfileFormImageFiles = Array<File>;

export interface UpdateProfileFormStateType {
  [stateKeys.ABOUT]?: string | null;
  [stateKeys.FORENAME]?: string | null;
  [stateKeys.SURNAME]?: string | null;
  [stateKeys.EMAIL]: string;
  [stateKeys.DISPLAY_NAME]: string;
  [stateKeys.IMAGE_FILES]?: UpdateProfileFormImageFiles;
}
