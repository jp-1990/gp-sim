export interface LiveryDataType {
  id: string;
  title: string;
  car: string;
  description: string;
  rating: number | undefined;
  downloads: number;
  imgUrls: string[];
  price: string;
  author: string;
  tags: string[];
}
export type LiveriesDataType = LiveryDataType[];

export interface CreateLiveryDataType extends LiveryDataType {
  files: File[];
  publicLivery: boolean;
  privateGarage: boolean;
  garageName: string;
  garageKey: string;
}
