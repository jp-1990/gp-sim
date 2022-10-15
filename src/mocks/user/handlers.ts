import { rest } from 'msw';
import { UpdateUserProfileDataType, UserDataType } from '../../types';
import userData from '../../utils/dev-data/users.json';
import liveriesData from '../../utils/dev-data/liveries.json';

export const userHandlers = [
  rest.get(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/users`,
    (_, res, ctx) => {
      const users = userData.map(({ id, about, displayName, image }) => {
        const userCreatedliveries = liveriesData.reduce((prev, cur) => {
          const output = [...prev];
          if (cur.creator.id === id) output.push(cur.id);
          return output;
        }, [] as string[]);

        return {
          id,
          about,
          displayName,
          image,
          liveries: userCreatedliveries
        };
      });

      return res(ctx.delay(), ctx.status(200), ctx.json(users));
    }
  ),
  rest.patch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/users/:id`,
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
  ),
  rest.get(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/api/v1/users/current`,
    (req, res, ctx) => {
      const id = req.url.searchParams.get('id');
      const token = req.headers.get('authorization');

      if (!id || !token) return res(ctx.delay(), ctx.status(401));

      const user = userData.find((el) => el.id === '0');
      if (!user) return res(ctx.delay(), ctx.status(404));

      return res(ctx.delay(), ctx.status(200), ctx.json(user));
    }
  )
];

const formatPutUserResponse = (
  payload: UpdateUserProfileDataType
): UserDataType => {
  const { imageFiles, ...userData } = payload;
  const garages: string[] = [];
  const liveries: string[] = [];

  // create new garage entry in database (send garage data)
  const now = new Date(Date.now()).valueOf();
  const createdAt = now;
  const updatedAt = now;

  // upload images, link urls to garage
  const image: string = '/car6.png'; // resulting url from uploading the image

  return {
    ...userData,
    createdAt,
    updatedAt,
    image,
    garages,
    liveries,
    lastLogin: now
  };
};
