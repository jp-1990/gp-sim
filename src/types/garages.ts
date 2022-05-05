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
