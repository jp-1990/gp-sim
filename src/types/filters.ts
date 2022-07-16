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
  user?: string;
  rating?: number;
  page?: number;
}

export enum LiveriesFilterKeys {
  IDS = 'ids',
  SEARCH = 'search',
  CAR = 'car',
  PRICE_MIN = 'priceMin',
  PRICE_MAX = 'priceMax',
  CREATED = 'created',
  USER = 'user',
  RATING = 'rating',
  PAGE = 'page'
}

export interface GaragesFilters {
  created?: Order;
  user?: string;
  ids?: string;
  page?: number;
  perPage?: number;
}

export enum GaragesFilterKeys {
  CREATED = 'created',
  USER = 'user',
  IDS = 'ids',
  PAGE = 'page',
  PER_PAGE = 'perPage'
}

export interface UserFilters {
  created?: Order;
  ids?: string;
}

export enum UserFilterKeys {
  CREATED = 'created',
  IDS = 'ids'
}
