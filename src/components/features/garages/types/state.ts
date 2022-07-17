import { stateKeys as createGarageStateKeys } from '../CreateGarage/config';
import { stateKeys as updateGarageStateKeys } from '../UpdateGarage/config';

type GarageFormImageFiles = File[];

export interface CreateGarageFormStateType {
  [createGarageStateKeys.TITLE]: string;
  [createGarageStateKeys.DESCRIPTION]?: string;
  [createGarageStateKeys.IMAGE_FILES]?: GarageFormImageFiles;
}

export interface UpdateGarageFormStateType {
  [updateGarageStateKeys.TITLE]?: string;
  [updateGarageStateKeys.DESCRIPTION]?: string;
  [updateGarageStateKeys.IMAGE_FILES]?: GarageFormImageFiles;
  [updateGarageStateKeys.DRIVERS]?: string[];
}
