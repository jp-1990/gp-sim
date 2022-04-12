export enum Order {
  ASC = 'asc',
  DESC = 'desc'
}

export interface LiveriesFilters {
  search?: string;
  car?: string;
  priceMin?: number;
  priceMax?: number;
  createdAt?: Order;
  rating?: number;
}
