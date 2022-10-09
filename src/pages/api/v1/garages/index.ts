import type { NextApiRequest, NextApiResponse } from 'next';
import { GaragesDataType, Method } from '../../../../types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GaragesDataType>
) {
  const method = req.method;

  switch (method) {
    case Method.GET: {
      res.status(200).json([
        {
          id: '0',
          createdAt: 0,
          updatedAt: 0,
          creator: { id: '0', displayName: 'name', image: '' },
          title: 'get garage',
          description: 'desc',
          image: '',
          drivers: [],
          liveries: []
        }
      ]);
    }
    case Method.POST: {
      res.status(200).json([
        {
          id: '0',
          createdAt: 0,
          updatedAt: 0,
          creator: { id: '0', displayName: 'name', image: '' },
          title: 'created garage',
          description: 'desc',
          image: '',
          drivers: [],
          liveries: []
        }
      ]);
    }
  }
}
