import { carsHandlers } from './cars/handlers';
import { garagesHandlers } from './garages/handlers';
import { liveriesHandlers } from './liveries/handlers';
import { userHandlers } from './user/handlers';

export const handlers = [
  ...carsHandlers,
  ...garagesHandlers,
  ...liveriesHandlers,
  ...userHandlers
];
