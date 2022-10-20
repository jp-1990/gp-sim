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
}
export type GaragesDataType = GarageDataType[];
export type GaragesResponseType = GaragesDataType;

export interface CreateGarageDataType
  extends Pick<GarageDataType, 'creator' | 'title' | 'description'> {
  imageFiles: Array<File>;
}

export type UpdateGarageDataType = Partial<
  Pick<GarageDataType, 'id' | 'title' | 'description' | 'drivers'> & {
    imageFiles: Array<File>;
  }
>;
