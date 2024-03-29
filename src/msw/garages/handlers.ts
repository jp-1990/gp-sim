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
      const params = ['ids', 'created', 'user', 'search'];
      const garages = [...data];

      const extractedParams = [
        ...params.map((param) => req.url.searchParams.get(param))
      ] as [string | null, string | null, string | null, string | null];
      if (!extractedParams[2]) extractedParams[2] = '0';
      const filteredGarages = applyGarageFilters(garages, extractedParams);

      return res(ctx.delay(), ctx.status(200), ctx.json(filteredGarages));
    }
  ),
  rest.post(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/garages`,
    (req, res, ctx) => {
      // dev util. formats and returns input
      const garage = formatPostGarageResponse(req.body as CreateGarageDataType);

      return res(ctx.delay(), ctx.status(200), ctx.json(garage));
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
      const body = req.body as UpdateGarageDataType;
      return res(ctx.delay(), ctx.status(200), ctx.json({ id: body.id }));
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
  rest.patch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/garages/:id/liveries`,
    (req, res, ctx) => {
      const { ids } = req.params as { ids: string };
      return res(
        ctx.delay(),
        ctx.status(200),
        ctx.json({ ids: ids.split(',') })
      );
    }
  ),
  rest.patch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/garages/:id/users`,
    (req, res, ctx) => {
      const { ids } = req.params as { ids: string };
      return res(ctx.delay(), ctx.status(200), ctx.json({ ids }));
    }
  ),
  rest.post(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/garages/:id/join`,
    (req, res, ctx) => {
      const { id } = req.params as { id: string };
      return res(ctx.delay(), ctx.status(200), ctx.json({ id }));
    }
  ),
  rest.post(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/garages/:id/leave`,
    (req, res, ctx) => {
      const { id } = req.params as { id: string };
      return res(ctx.delay(), ctx.status(200), ctx.json({ id }));
    }
  )
];

const formatPostGarageResponse = (
  newGarage: CreateGarageDataType
): GarageDataType => {
  const { imageFile: _, ...garageData } = newGarage;
  const drivers: string[] = [];
  const liveries: string[] = [];

  // create new garage entry in database (send garage data)
  const id = `${new Date(Date.now()).valueOf()}`;
  const now = new Date(Date.now()).valueOf();
  const createdAt = now;
  const updatedAt = now;
  const creator = {
    id: '0',
    displayName: '',
    image: ''
  };
  const searchHelpers = [garageData.title];

  // add garageId to user

  // upload images, link urls to garage
  const image = '/car6.png'; // resulting urls from uploading the images

  return {
    ...garageData,
    createdAt,
    creator,
    drivers,
    id,
    image,
    liveries,
    searchHelpers,
    updatedAt
  };
};
