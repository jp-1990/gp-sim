import { CreatorType } from './user';

export interface LiveryDataType {
  id: string;
  createdAt: number;
  updatedAt: number;
  creator: CreatorType;
  title: string;
  description: string;
  car: string;
  price: number;
  tags: string;
  searchHelpers: string[];
  isPublic: boolean;
  images: string[];
  liveryFiles: string;
  rating: number;
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
  extends Pick<
    LiveryDataType,
    'creator' | 'title' | 'description' | 'car' | 'price' | 'tags' | 'isPublic'
  > {
  imageFiles: Array<File>;
  liveryZip: Blob;
  garage?: string;
  garageKey?: string;
}
