export enum Order {
  ASC = 'asc',
  DESC = 'desc'
}

export interface LiveriesFilters {
  search?: string;
  car?: string;
  priceMin?: number;
  priceMax?: number;
  created?: Order;
  rating?: number;
}

export enum LiveriesFilterKeys {
  SEARCH = 'search',
  CAR = 'car',
  PRICE_MIN = 'priceMin',
  PRICE_MAX = 'priceMax',
  CREATED = 'created',
  RATING = 'rating'
}

export const isFilterKey = (key: string): key is keyof LiveriesFilters => {
  return Object.values(LiveriesFilterKeys).includes(key as any);
};
