import type { NextApiRequest, NextApiResponse } from 'next';
import { GarageDataType, Method } from '../../../../types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GarageDataType>
) {
  const method = req.method;
  const query = req.query;

  switch (method) {
    case Method.GET: {
      res.status(200).json({
        id: query.id as string,
        createdAt: 0,
        updatedAt: 0,
        creator: { id: '0', displayName: 'name', image: '' },
        title: 'get garage by id',
        description: 'desc',
        image: '',
        drivers: [],
        liveries: []
      });
    }
    case Method.PATCH: {
      res.status(200).json({
        id: query.id as string,
        createdAt: 0,
        updatedAt: 0,
        creator: { id: '0', displayName: 'name', image: '' },
        title: 'update garage by id',
        description: 'desc',
        image: '',
        drivers: [],
        liveries: []
      });
    }
    case Method.DELETE: {
      res.status(200).json({
        id: query.id as string,
        createdAt: 0,
        updatedAt: 0,
        creator: { id: '0', displayName: 'name', image: '' },
        title: 'delete garage by id',
        description: 'desc',
        image: '',
        drivers: [],
        liveries: []
      });
    }
  }
}
