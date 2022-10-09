import type { NextApiRequest, NextApiResponse } from 'next';
import { GarageDataType, Method } from '../../../../../types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pick<GarageDataType, 'id'>>
) {
  const method = req.method;
  const query = req.query;

  switch (method) {
    case Method.DELETE: {
      res.status(200).json({
        id: query.id as string
      });
    }
  }
}
