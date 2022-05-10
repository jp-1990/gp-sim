import { carsHandlers } from './cars/handlers';
import { liveriesHandlers } from './liveries/handlers';

export const handlers = [...carsHandlers, ...liveriesHandlers];
