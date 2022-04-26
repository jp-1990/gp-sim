import { stateKeys } from '../config';

type CreateLiveryFormLiveryFiles = Array<File>;
type CreateLiveryFormImageFiles = Array<File>;

export interface CreateLiveryFormStateType {
  [stateKeys.TITLE]: string;
  [stateKeys.CAR]: string;
  [stateKeys.DESCRIPTION]?: string;
  [stateKeys.LIVERY_FILES]: CreateLiveryFormLiveryFiles;
  [stateKeys.PUBLIC_LIVERY]: boolean;
  [stateKeys.PRIVATE_GARAGE]?: boolean;
  [stateKeys.GARAGE]?: string;
  [stateKeys.GARAGE_KEY]?: string;
  [stateKeys.PRICE]?: number | string;
  [stateKeys.SEARCH_TAGS]?: string[];
  [stateKeys.IMAGE_FILES]?: CreateLiveryFormImageFiles;
}
