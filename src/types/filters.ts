import { EntityId } from '@reduxjs/toolkit';

export enum Order {
  ASC = 'asc',
  DESC = 'desc'
}

export interface LiveriesFilters {
  ids?: string;
  search?: string;
  car?: string;
  created?: Order;
  rating?: string;
  lastLiveryId?: EntityId | null;
}

export enum LiveriesFilterKeys {
  IDS = 'ids',
  SEARCH = 'search',
  CAR = 'car',
  CREATED = 'created',
  RATING = 'rating'
}

export interface GaragesFilters {
  created?: Order;
  ids?: string;
  search?: string;
}

export enum GaragesFilterKeys {
  CREATED = 'created',
  IDS = 'ids',
  SEARCH = 'search'
}

export interface UserFilters {
  created?: Order;
  ids?: string;
}

export enum UserFilterKeys {
  CREATED = 'created',
  IDS = 'ids'
}
