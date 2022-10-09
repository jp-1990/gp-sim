import type { NextApiRequest, NextApiResponse } from 'next';
import { LiveriesDataType, LiveryDataType, Method } from '../../../../types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LiveriesDataType | LiveryDataType>
) {
  const method = req.method;

  switch (method) {
    case Method.GET: {
      res.status(200).json([
        {
          id: '0',
          createdAt: 0,
          updatedAt: 0,
          creator: { id: '0', displayName: '', image: '' },
          title: 'get liveries',
          description: 'desc',
          car: 'car',
          price: undefined,
          tags: undefined,
          searchHelpers: [],
          isPublic: true,
          images: [],
          liveryFiles: '',
          rating: undefined,
          downloads: 0
        }
      ]);
    }
    case Method.POST: {
      res.status(200).json({
        id: '0',
        createdAt: 0,
        updatedAt: 0,
        creator: { id: '0', displayName: '', image: '' },
        title: 'create livery',
        description: 'desc',
        car: 'car',
        price: undefined,
        tags: undefined,
        searchHelpers: [],
        isPublic: true,
        images: [],
        liveryFiles: '',
        rating: undefined,
        downloads: 0
      });
    }
  }
}
