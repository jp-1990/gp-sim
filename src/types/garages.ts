import { CreatorType } from './user';

export interface GarageDataType {
  id: string;
  createdAt: number;
  updatedAt: number;
  creator: CreatorType;
  title: string;
  description: string | undefined;
  image: string;
  drivers: string[];
  liveries: string[];
  searchHelpers: string[];
}
export type GaragesDataType = GarageDataType[];
export type GaragesResponseType = GaragesDataType;

export interface CreateGarageDataType
  extends Pick<GarageDataType, 'title' | 'description'> {
  imageFile: File;
}

export type UpdateGarageDataType = Pick<GarageDataType, 'id'> &
  Partial<
    Pick<GarageDataType, 'title' | 'description'> & {
      imageFile: File;
    }
  >;
