import { stateKeys as createGarageStateKeys } from '../CreateGarage/config';
import { stateKeys as updateGarageStateKeys } from '../UpdateGarage/config';

type CreateGarageFormImageFiles = File[];

export interface CreateGarageFormStateType {
  [createGarageStateKeys.TITLE]: string;
  [createGarageStateKeys.DESCRIPTION]?: string;
  [createGarageStateKeys.IMAGE_FILES]?: CreateGarageFormImageFiles;
}

export interface UpdateGarageFormStateType {
  [updateGarageStateKeys.TITLE]: string;
  [updateGarageStateKeys.DESCRIPTION]?: string;
  [updateGarageStateKeys.IMAGES]?: string[];
  [updateGarageStateKeys.DRIVERS]?: string[];
}
