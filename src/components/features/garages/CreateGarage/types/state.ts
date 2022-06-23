import { stateKeys } from '../config';

type CreateGarageFormImageFiles = Array<File>;

export interface CreateGarageFormStateType {
  [stateKeys.TITLE]: string;
  [stateKeys.DESCRIPTION]?: string;
  [stateKeys.IMAGE_FILES]?: CreateGarageFormImageFiles;
}
