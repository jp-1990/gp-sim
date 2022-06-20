import { CreatorType } from './user';

export interface LiveryDataType {
  id: string | number;
  createdAt: number;
  updatedAt: number;
  creator: CreatorType;
  title: string;
  description: string | undefined;
  car: string;
  price: number | undefined;
  tags: string | undefined;
  searchHelpers: string[];
  isPublic: boolean;
  images: string[];
  liveryFiles: string;
  rating: number | undefined;
  downloads: number;
}
export type LiveriesDataType = LiveryDataType[];
export type LiveriesResponseType = {
  liveries: LiveriesDataType;
  total: number;
  maxPrice: number;
  perPage: number;
  page: number;
};

export interface CreateLiveryDataType
  extends Omit<
    LiveryDataType,
    | 'id'
    | 'images'
    | 'liveryFiles'
    | 'rating'
    | 'downloads'
    | 'createdAt'
    | 'updatedAt'
    | 'searchHelpers'
  > {
  imageFiles: Array<File>;
  liveryZip: Blob;
  garage?: string;
  garageKey?: string;
}
