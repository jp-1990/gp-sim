import type { NextApiRequest, NextApiResponse } from 'next';
import { UsersDataType, Method } from '../../../../types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UsersDataType>
) {
  const method = req.method;

  switch (method) {
    case Method.GET: {
      res.status(200).json([
        {
          id: '0',
          createdAt: 0,
          updatedAt: 0,
          lastLogin: 0,
          forename: 'test',
          surname: 'user',
          displayName: '',
          email: '',
          about: undefined,
          image: undefined,
          garages: [],
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
          lastLogin: 0,
          forename: 'created',
          surname: 'user',
          displayName: '',
          email: '',
          about: undefined,
          image: undefined,
          garages: [],
          liveries: []
        }
      ]);
    }
  }
}
