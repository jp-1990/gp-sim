import { GarageDataType, Method } from '../../../../types';
import {
  firestore,
  NextApiResponse,
  NextApiRequestWithAuth,
  Collection,
  withAuth
} from '../../../../utils/firebase/admin';

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<GarageDataType | { [key: string]: string }>
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

        // check req params
        const params = {
          id: req.query.id as string | undefined
        };

        if (!params.id) {
          return res.status(400).json({ error: 'malformed request params' });
        }

        const garageRef = garagesRef.doc(params.id);
        const garage = (await garageRef.get()).data() as
          | GarageDataType
          | undefined;

        // user can only access a garage if they own it or belong to it
        if (
          garage?.creator.id !== req.uid &&
          !garage?.drivers.includes(req.uid)
        ) {
          return res.status(401).json({ error: 'unauthorized' });
        }

        return res.status(200).json(garage);
      } catch (err) {
        return res.status(500).json({ error: 'internal error' });
      }
    }
    case Method.DELETE: {
      // try {
      //   // check isAuthenticated
      //   if (!req.isAuthenticated || !req.uid) {
      //     return res.status(401).json({ error: 'unauthorized' });
      //   }
      //   // check req params
      //   const params = {
      //     id: req.query.id as string | undefined
      //   };
      //   if (!params.id) {
      //     return res.status(400).json({ error: 'malformed request params' });
      //   }
      //   const liveryRef = garagesRef.doc(params.id);
      //   const livery = await liveryRef.get();
      //   // delete only if creator id matches auth user id
      //   if (livery.data()?.creator.id === req.uid) liveryRef.delete();
      //   return res.status(200).json({ id: params.id });
      // } catch (err) {
      //   return res.status(500).json({ error: 'internal error' });
      // }
    }
    default: {
      return res
        .status(501)
        .json({ error: 'requested endpoint does not exist' });
    }
  }
}

export default withAuth(handler);
