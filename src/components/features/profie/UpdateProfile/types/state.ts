import { stateKeys } from '../config';

export interface UpdateProfileFormStateType {
  [stateKeys.ABOUT]?: string | null;
  [stateKeys.FORENAME]?: string | null;
  [stateKeys.SURNAME]?: string | null;
  [stateKeys.EMAIL]: string;
  [stateKeys.DISPLAY_NAME]: string;
  [stateKeys.IMAGE_FILES]?: (string | File)[];
}
