import { setupServer } from 'msw/node';
import { handlers, testHandlers } from './handlers';

export const server = setupServer(...handlers);
export const testServer = setupServer(...testHandlers);
