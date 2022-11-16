import { rest } from 'msw';
import {
  CreateUserProfileDataType,
  UpdateUserProfileDataType,
  UserDataType
} from '../../types';
import userData from '../../utils/dev-data/users.json';
import liveriesData from '../../utils/dev-data/liveries.json';

export const userHandlers = [
  rest.patch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/users/current/liveries`,
    (req, res, ctx) => {
      const token = req.headers.get('authorization');
      const liveriesToAdd = (req.body as Record<string, any>)
        .liveries as string[];

      if (!token) return res(ctx.delay(), ctx.status(401));

      const user = userData.find((el) => el.id === '0');
      if (!user) return res(ctx.delay(), ctx.status(404));

      user.liveries.push(...liveriesToAdd);

      return res(ctx.delay(), ctx.status(200), ctx.json(user));
    }
  ),
  rest.get(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/users/current`,
    (req, res, ctx) => {
      const token = req.headers.get('authorization');

      if (!token) return res(ctx.delay(), ctx.status(401));

      const user = userData.find((el) => el.id === '0');
      if (!user) return res(ctx.delay(), ctx.status(404));

      return res(ctx.delay(), ctx.status(200), ctx.json(user));
    }
  ),
  rest.patch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/users/current`,
    (req, res, ctx) => {
      const response = formatPutUserResponse(
        req.body as UpdateUserProfileDataType
      );

      return res(ctx.delay(), ctx.status(200), ctx.json(response));
    }
  ),
  rest.get(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/users`,
    (_, res, ctx) => {
      const users = userData.map(({ id, ...user }) => {
        const userCreatedliveries = liveriesData.reduce((prev, cur) => {
          const output = [...prev];
          if (cur.creator.id === id) output.push(cur.id);
          return output;
        }, [] as string[]);

        return {
          id,
          ...user,
          liveries: userCreatedliveries
        };
      });

      return res(ctx.delay(), ctx.status(200), ctx.json(users));
    }
  ),
  rest.post(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/users`,
    (req, res, ctx) => {
      const token = req.headers.get('authorization');
      const body = req.body as {
        data: CreateUserProfileDataType;
      };
      const { data } = body;

      if (!token) return res(ctx.delay(), ctx.status(401));

      const user = {
        id: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastLogin: Date.now(),
        forename: data.forename ?? null,
        surname: data.surname ?? null,
        displayName: data.displayName,
        email: data.email,
        about: null,
        image: null,
        garages: [],
        liveries: []
      };

      return res(ctx.delay(), ctx.status(200), ctx.json(user));
    }
  ),
  rest.get(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/users/:id`,
    (req, res, ctx) => {
      const { id } = req.params;

      const user = userData.find((el) => el.id === id);
      if (!user) return res(ctx.delay(), ctx.status(400));

      const { about, displayName, image } = user;

      const liveries = liveriesData.reduce((prev, cur) => {
        const output = [...prev];
        if (cur.creator.id === id) output.push(cur.id);
        return output;
      }, [] as string[]);

      return res(
        ctx.delay(),
        ctx.status(200),
        ctx.json({ id, about, displayName, image, liveries })
      );
    }
  )
];

const formatPutUserResponse = (
  payload: UpdateUserProfileDataType
): UserDataType => {
  const userData = payload;
  const garages: string[] = [];
  const liveries: string[] = [];

  // create new garage entry in database (send garage data)
  const now = new Date(Date.now()).valueOf();
  const createdAt = now;
  const updatedAt = now;
  const id = '0';

  // upload images, link urls to garage
  const image = '/car6.png'; // resulting url from uploading the image

  return {
    id,
    ...userData,
    createdAt,
    updatedAt,
    image,
    garages,
    liveries,
    lastLogin: now
  } as UserDataType;
};
