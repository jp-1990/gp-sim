import { rest } from 'msw';
import { applyFilters } from '../../utils/dev-data/utils';
import data from '../../utils/dev-data/liveries.json';

export const liveriesHandlers = [
  rest.get(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/liveries`,
    (req, res, ctx) => {
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
      return res(ctx.delay(), ctx.status(200), ctx.json(filteredLiveries));
    }
  ),
  rest.get(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL
    }/liveries/:id`,
    (req, res, ctx) => {
      const { id } = req.params;
      const livery = data.find((el) => el.id === id);
      return res(ctx.delay(), ctx.status(200), ctx.json(livery));
    }
  )
];

// export const postLivery = async (newLivery: PostLiveryArgs) => {
//   const { liveryZip, imageFiles, ...liveryData } = newLivery;
//   const rating = undefined;
//   const downloads = 0;

//   // create new livery entry in database (send livery data)
//   const id = randomUUID();
//   const now = new Date(Date.now()).valueOf();
//   const createdAt = now;
//   const updatedAt = now;
//   const tags = liveryData.tags?.split(',') ?? [];
//   const searchHelpers = Array.from(
//     new Set([...tags, liveryData.title, liveryData.creator.displayName])
//   );

//   // add liveryId to user

//   // check user garages, if garage in garages => add livery to garage
//   if (liveryData.garage) {
//   }

//   // find garage where key = garageKey => add livery to garage, add garageId to user
//   if (liveryData.garageKey) {
//   }

//   // upload images, link urls to livery
//   const images: string[] = ['/car6.png', '/car6.png', '/car6.png', '/car6.png']; // resulting urls from uploading the images

//   // upload files, link url to livery
//   const liveryFiles = '/test-livery-title.zip'; // resulting url from uploading the livery zip

//   // link image ids and file id to livery (add urls to new livery document)

//   return new Promise<LiveryDataType>((resolve) => {
//     setTimeout(
//       () =>
//         resolve({
//           ...liveryData,
//           createdAt,
//           downloads,
//           id,
//           images,
//           liveryFiles,
//           rating,
//           searchHelpers,
//           updatedAt
//         }),
//       700
//     );
//   });
// };
