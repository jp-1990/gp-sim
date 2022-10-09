import { rest } from 'msw';
import { applyGarageFilters } from '../../utils/dev-data/utils';
import data from '../../utils/dev-data/garages.json';
import {
  CreateGarageDataType,
  GarageDataType,
  UpdateGarageDataType
} from '../../types';

export const garagesHandlers = [
  rest.get(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/garages`,
    (req, res, ctx) => {
      const params = ['ids', 'created', 'user'];
      const garages = [...data];

      const extractedParams = [
        ...params.map((param) => req.url.searchParams.get(param))
      ] as [string | null, string | null, string | null];

      let filteredGarages = applyGarageFilters(garages, extractedParams);

      const total = filteredGarages.length;

      const page = req.url.searchParams.get('page');
      const perPage = req.url.searchParams.get('perPage');

      if (page && !isNaN(+page) && perPage && !isNaN(+perPage)) {
        filteredGarages = filteredGarages.slice(
          +page * +perPage,
          +page * +perPage + +perPage
        );
      }

      return res(
        ctx.delay(),
        ctx.status(200),
        ctx.json({
          total,
          page,
          perPage,
          garages: filteredGarages
        })
      );
    }
  ),
  rest.get(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/garages/:id`,
    (req, res, ctx) => {
      const { id } = req.params;
      const garage = data.find((el) => el.id === id);
      return res(ctx.delay(), ctx.status(200), ctx.json(garage));
    }
  ),
  rest.patch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/garages/:id`,
    (req, res, ctx) => {
      const originalValues =
        data.find(({ id }) => id === (req?.body as UpdateGarageDataType).id) ||
        {};
      const newValues = req.body as UpdateGarageDataType;
      const garage = { ...originalValues, ...newValues, image: '/car6.png' };
      return res(ctx.delay(), ctx.status(200), ctx.json(garage));
    }
  ),
  rest.post(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/garages`,
    (req, res, ctx) => {
      const garage = formatPostGarageResponse(req.body as CreateGarageDataType);

      // dev util. formats and returns input
      return res(ctx.delay(), ctx.status(200), ctx.json(garage));
    }
  ),
  rest.delete(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/garages/:id`,
    (req, res, ctx) => {
      const { id } = req.params;
      return res(ctx.delay(), ctx.status(200), ctx.json({ id }));
    }
  ),
  rest.delete(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/garages/livery/:id`,
    (req, res, ctx) => {
      const { id } = req.params;
      return res(ctx.delay(), ctx.status(200), ctx.json({ id }));
    }
  ),
  rest.delete(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/garages/user/:id`,
    (req, res, ctx) => {
      const { id } = req.params;
      return res(ctx.delay(), ctx.status(200), ctx.json({ id }));
    }
  )
];

const formatPostGarageResponse = (
  newGarage: CreateGarageDataType
): GarageDataType => {
  const { imageFiles, ...garageData } = newGarage;
  const drivers: string[] = [];
  const liveries: string[] = [];

  // create new garage entry in database (send garage data)
  const id = `${new Date(Date.now()).valueOf()}`;
  const now = new Date(Date.now()).valueOf();
  const createdAt = now;
  const updatedAt = now;

  // add garageId to user

  // upload images, link urls to garage
  const image: string = '/car6.png'; // resulting urls from uploading the images

  return {
    ...garageData,
    createdAt,
    drivers,
    id,
    image,
    liveries,
    updatedAt
  };
};
