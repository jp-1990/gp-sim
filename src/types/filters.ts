export enum Order {
  ASC = 'asc',
  DESC = 'desc'
}

export interface LiveriesFilters {
  ids?: string;
  search?: string;
  car?: string;
  priceMin?: number;
  priceMax?: number;
  created?: Order;
  rating?: number;
  page?: number;
}

export enum LiveriesFilterKeys {
  SEARCH = 'search',
  CAR = 'car',
  PRICE_MIN = 'priceMin',
  PRICE_MAX = 'priceMax',
  CREATED = 'created',
  RATING = 'rating',
  PAGE = 'page'
}

export interface GaragesFilters {
  created?: Order;
  creator?: string;
  ids?: string;
  page?: number;
  perPage?: number;
}

export enum GaragesFilterKeys {
  CREATED = 'created',
  CREATOR = 'creator'
}
