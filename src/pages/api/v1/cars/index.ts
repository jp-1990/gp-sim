import type { NextApiRequest, NextApiResponse } from 'next';
import { CarsDataType, Method } from '../../../types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CarsDataType>
) {
  const method = req.method;

  if (method === Method.GET) {
    res.status(200).json([{ id: '0', name: 'cars', class: 'GT' }]);
  }
}
