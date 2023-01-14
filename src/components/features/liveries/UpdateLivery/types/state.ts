import { stateKeys } from '../config';

export interface UpdateLiveryFormStateType {
  [stateKeys.TITLE]: string;
  [stateKeys.DESCRIPTION]?: string;
  [stateKeys.PUBLIC_LIVERY]: boolean;
  [stateKeys.PRICE]?: number | string;
  [stateKeys.SEARCH_TAGS]?: string;
  [stateKeys.IMAGE_FILES]?: Array<File | string>;
}
