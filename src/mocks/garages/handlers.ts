import { rest } from 'msw';
import { applyGarageFilters } from '../../utils/dev-data/utils';
import data from '../../utils/dev-data/garages.json';

export const garagesHandlers = [
  rest.get(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/garages`,
    (req, res, ctx) => {
      const params = ['ids', 'created'];
      const garages = [...data];

      const extractedParams = [
        ...params.map((param) => req.url.searchParams.get(param))
      ] as [string | null, string | null];

      let filteredGarages = applyGarageFilters(garages, extractedParams);

      const total = filteredGarages.length;

      return res(
        ctx.delay(),
        ctx.status(200),
        ctx.json({
          total,
          garages: filteredGarages
        })
      );
    }
  ),
  rest.get(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/garages/:id`,
    (req, res, ctx) => {
      const { id } = req.params;
      const garage = data.find((el) => el.id === id);
      return res(ctx.delay(), ctx.status(200), ctx.json(garage));
    }
  ),
  rest.post(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/garages`,
    (req, res, ctx) => {
      // dev util. formats and returns input
      return res(ctx.delay(), ctx.status(200), ctx.json(req.body));
    }
  )
];
