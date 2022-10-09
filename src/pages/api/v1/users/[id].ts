import type { NextApiRequest, NextApiResponse } from 'next';
import { Method, UserDataType } from '../../../../types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserDataType>
) {
  const method = req.method;
  const query = req.query;

  switch (method) {
    case Method.GET: {
      res.status(200).json({
        id: query.id as string,
        createdAt: 0,
        updatedAt: 0,
        lastLogin: 0,
        forename: 'test',
        surname: 'user',
        displayName: 'get user',
        email: '',
        about: undefined,
        image: undefined,
        garages: [],
        liveries: []
      });
    }
    case Method.PATCH: {
      res.status(200).json({
        id: query.id as string,
        createdAt: 0,
        updatedAt: 0,
        lastLogin: 0,
        forename: 'test',
        surname: 'user',
        displayName: 'update user',
        email: '',
        about: undefined,
        image: undefined,
        garages: [],
        liveries: []
      });
    }
  }
}
