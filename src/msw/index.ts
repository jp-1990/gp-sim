/* eslint-disable @typescript-eslint/no-var-requires */
if (typeof window === 'undefined') {
  const { server } = require('./server');
  server.listen({ onUnhandledRequest: 'warn' });
} else {
  const { worker } = require('./browser');
  worker.start({ onUnhandledRequest: 'warn' });
}

export {};
