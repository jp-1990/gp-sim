import type { NextApiRequest, NextApiResponse } from 'next';
import { LiveryDataType, Method } from '../../../../types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LiveryDataType | { id: string }>
) {
  const method = req.method;
  const query = req.query;

  switch (method) {
    case Method.GET: {
      res.status(200).json({
        id: query.id as string,
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
      });
    }
    case Method.DELETE: {
      res.status(200).json({
        id: query.id as string
      });
    }
  }
}
