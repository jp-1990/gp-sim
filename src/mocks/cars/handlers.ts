import { rest } from 'msw';
import data from '../../utils/dev-data/cars.json';

export const carsHandlers = [
  rest.get(`${process.env.API_BASE_URL}/cars`, async (_, res, ctx) => {
    return res(ctx.delay(), ctx.status(200), ctx.json({ data }));
  })
];
