export interface LiveryDataType {
  id: string;
  rating: number;
  downloads: number;
  imgUrls: string[];
  price: string;
  author: string;
  title: string;
  car: string;
  tags: string[];
  description: string;
}
export type LiveriesDataType = LiveryDataType[];
