import { CreatorType } from './user';

export interface LiveryDataType {
  id: string;
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

export interface CreateLiveryDataType
  extends Omit<
    LiveryDataType,
    'id' | 'images' | 'liveryFiles' | 'rating' | 'downloads'
  > {
  imageFiles: Array<File>;
  liveryZip: Blob;
}
