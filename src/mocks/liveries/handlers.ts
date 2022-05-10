import { rest } from 'msw';
import { applyFilters } from '../../utils/dev-data/utils';
import data from '../../utils/dev-data/liveries.json';

export const liveriesHandlers = [
  rest.get(`${process.env.API_BASE_URL}/liveries`, (req, res, ctx) => {
    const params = [
      'search',
      'car',
      'priceMin',
      'priceMax',
      'createdAt',
      'rating',
      'quantity'
    ];
    const liveries = [...data];
    liveries.sort((a, b) => b.downloads - a.downloads);
    const filteredLiveries = applyFilters(liveries, [
      ...params.map((param) => req.url.searchParams.get(param))
    ]);
    return res(
      ctx.delay(),
      ctx.status(200),
      ctx.json({ data: filteredLiveries })
    );
  }),
  rest.get(`${process.env.API_BASE_URL}/liveries/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const livery = data.find((el) => el.id === id);
    return res(ctx.delay(), ctx.status(200), ctx.json({ data: livery }));
  })
];
