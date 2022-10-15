import type { NextApiRequest, NextApiResponse } from 'next';
import { Method, UserDataType } from '../../../../types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserDataType>
) {
  const method = req.method;

  switch (method) {
    case Method.GET: {
      res.status(200).json({
        id: '0',
        createdAt: 0,
        updatedAt: 0,
        lastLogin: 0,
        forename: 'current',
        surname: 'user',
        displayName: '',
        email: '',
        about: undefined,
        image: undefined,
        garages: [],
        liveries: []
      });
    }
  }
}
