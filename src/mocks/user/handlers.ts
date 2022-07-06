import { rest } from 'msw';
import { UpdateUserProfileDataType, UserDataType } from '../../types';
import userData from '../../utils/dev-data/users.json';
import liveriesData from '../../utils/dev-data/liveries.json';

export const userHandlers = [
  rest.put(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/user/:id`,
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
    }/user/:id`,
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
