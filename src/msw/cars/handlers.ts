import { rest } from 'msw';
import data from '../../utils/dev-data/cars.json';

export const carsHandlers = [
  rest.get(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/cars`,
    async (_, res, ctx) => {
      return res(ctx.delay(), ctx.status(200), ctx.json(data));
    }
  )
];
