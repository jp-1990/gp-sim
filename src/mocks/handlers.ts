import { carsHandlers } from './cars/handlers';
import { garagesHandlers } from './garages/handlers';
import { liveriesHandlers } from './liveries/handlers';

export const handlers = [
  ...carsHandlers,
  ...garagesHandlers,
  ...liveriesHandlers
];
