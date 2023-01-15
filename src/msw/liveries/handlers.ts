import { rest } from 'msw';
import { applyLiveryFilters } from '../../utils/dev-data/utils';
import data from '../../utils/dev-data/liveries.json';
import { CreateLiveryDataType } from '../../types';

export const liveriesHandlers = [
  rest.get(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/liveries`,
    (req, res, ctx) => {
      const perPage = 12;
      const params = [
        'ids',
        'search',
        'car',
        'priceMin',
        'priceMax',
        'created',
        'rating',
        'user'
      ];
      const liveries = [...data.map((liv) => ({ ...liv, deleted: false }))];
      liveries.sort((a, b) => b.createdAt - a.createdAt);

      const extractedParams = [
        ...params.map((param) => req.url.searchParams.get(param))
      ] as [
        string | null,
        string | null,
        string | null,
        string | null,
        string | null,
        string | null,
        string | null,
        string | null
      ];
      let filteredLiveries = applyLiveryFilters(liveries, extractedParams);

      const lastLiveryId = req.url.searchParams.get('lastLiveryId');

      const lastLiveryIndex = filteredLiveries.findIndex(
        (l) => l.id === lastLiveryId
      );
      const sliceStart = lastLiveryIndex ? lastLiveryIndex + 1 : 0;

      filteredLiveries = filteredLiveries.slice(
        sliceStart,
        sliceStart + perPage
      );

      return res(ctx.delay(200), ctx.status(200), ctx.json(filteredLiveries));
    }
  ),
  rest.post(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/liveries`,
    (req, res, ctx) => {
      const livery = formatPostLiveryResponse(req.body as CreateLiveryDataType);
      return res(ctx.delay(), ctx.status(200), ctx.json(livery));
    }
  ),
  rest.get(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/liveries/:id`,
    (req, res, ctx) => {
      const { id } = req.params;
      const livery = data.find((el) => el.id === id);
      return res(ctx.delay(), ctx.status(200), ctx.json(livery));
    }
  ),
  rest.patch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/liveries/:id`,
    (req, res, ctx) => {
      const { id } = req.params;
      return res(ctx.delay(), ctx.status(200), ctx.json({ id }));
    }
  ),
  rest.delete(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/liveries/:id`,
    (req, res, ctx) => {
      const { id } = req.params;
      return res(ctx.delay(), ctx.status(200), ctx.json({ id }));
    }
  ),
  rest.get(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/liveries/download/:id`,
    (req, res, ctx) => {
      const { id } = req.params;
      return res(ctx.delay(), ctx.status(200), ctx.json({ id }));
    }
  )
];

const formatPostLiveryResponse = (newLivery: CreateLiveryDataType) => {
  const creator = { displayName: 'admin-test' };
  const {
    liveryZip: _liveryZip,
    imageFiles: _imageFiles,
    ...liveryData
  } = newLivery;
  const rating = undefined;
  const downloads = 0;

  // create new livery entry in database (send livery data)
  const id = new Date(Date.now()).valueOf();
  const now = new Date(Date.now()).valueOf();
  const createdAt = now;
  const updatedAt = now;
  const tags = liveryData.tags?.split(',') ?? [];
  const searchHelpers = Array.from(
    new Set([...tags, liveryData.title, creator.displayName])
  );

  // add liveryId to user

  // check user garages, if garage in garages => add livery to garage
  if (liveryData.garage) {
    //
  }

  // find garage where key = garageKey => add livery to garage, add garageId to user
  if (liveryData.garageKey) {
    //
  }

  // upload images, link urls to livery
  const images: string[] = ['/car6.png', '/car6.png', '/car6.png', '/car6.png']; // resulting urls from uploading the images

  // upload files, link url to livery
  const liveryFiles = '/test-livery-title.zip'; // resulting url from uploading the livery zip

  // link image ids and file id to livery (add urls to new livery document)

  return {
    ...liveryData,
    createdAt,
    downloads,
    id,
    images,
    liveryFiles,
    rating,
    searchHelpers,
    updatedAt
  };
};
