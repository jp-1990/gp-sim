import { rest } from 'msw';
import { UpdateUserProfileDataType, UserDataType } from '../../types';

export const userHandlers = [
  rest.put(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/user/:id`,
    (req, res, ctx) => {
      const response = formatPutUserResponse(
        req.body as UpdateUserProfileDataType
      );

      // dev util. formats and returns input
      return res(ctx.delay(), ctx.status(200), ctx.json(response));
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
