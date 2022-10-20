import type { NextApiRequest, NextApiResponse } from 'next';
import {
  GarageDataType,
  GaragesDataType,
  GaragesResponseType,
  Method
} from '../../../../types';
import {
  Collection,
  firestore,
  NextApiRequestWithAuth,
  withAuth
} from '../../../../utils/firebase/admin';

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<GaragesResponseType | [] | { error: string }>
) {
  const method = req.method;
  const garagesRef = firestore.collection(Collection.GARAGES);

  switch (method) {
    case Method.GET: {
      try {
        // check isAuthenticated
        if (!req.isAuthenticated || !req.uid) {
          return res.status(401).json({ error: 'unauthorized' });
        }

        const params = {
          created: req.query.created as
            | FirebaseFirestore.OrderByDirection
            | undefined,
          ids: req.query.ids as string | undefined,
          user: req.uid,
          search: req.query.search as string | undefined
        };

        /*
        TODO: FILTERING LOGIC
        filters:
          ids
          search
          user 
        */

        // get garages
        // prepare query
        type Order = [string, FirebaseFirestore.OrderByDirection | undefined];
        const orders: Order[] = [['createdAt', params.created]];

        type Filter = [string, FirebaseFirestore.WhereFilterOp, any];
        const filters: Filter[] = [['creator.id', '==', params.user]];

        let query =
          garagesRef as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
        for (const filter of filters) query = query.where(...filter);
        for (const order of orders) query = query.orderBy(...order);

        // execute
        const garagesSnapshot = await garagesRef.get();

        // process response
        const garages: GaragesDataType = [];
        garagesSnapshot.forEach((doc) => {
          const garage = doc.data() as unknown as GarageDataType;
          garages.push(garage);
        });

        return res.status(200).json(garages);
      } catch (err) {
        return res.status(500).json({ error: 'internal error' });
      }
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

export default withAuth(handler);
