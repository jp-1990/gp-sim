import { LiveriesDataType, LiveryDataType, Method } from '../../../../types';
import {
  firestore,
  NextApiResponse,
  NextApiRequestWithAuth,
  Collection,
  withAuth
} from '../../../../utils/firebase/admin';

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<LiveryDataType | { [key: string]: string }>
) {
  const method = req.method;
  const liveriesRef = firestore.collection(Collection.LIVERIES);

  switch (method) {
    case Method.GET: {
      try {
        // check req params
        const params = {
          id: req.query.id as string | undefined
        };

        if (!params.id) {
          return res.status(400).json({ error: 'malformed request params' });
        }

        const liveriesSnapshot = await liveriesRef
          .where('id', '==', params.id)
          .where('isPublic', '==', true)
          .get();

        // process response
        const liveries: LiveriesDataType = [];
        liveriesSnapshot.forEach((doc) => {
          const livery = doc.data() as unknown as LiveryDataType;
          liveries.push(livery);
        });

        return res.status(200).json(liveries[0]);
      } catch (err) {
        return res.status(500).json({ error: 'internal error' });
      }
    }
    case Method.DELETE: {
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

        const liveryRef = liveriesRef.doc(params.id);
        const livery = await liveryRef.get();

        // delete only if creator id matches auth user id
        if (livery.data()?.creator.id !== req.uid) {
          return res.status(401).json({ error: 'unauthorized' });
        }

        await liveryRef.delete();

        return res.status(200).json({ id: params.id });
      } catch (err) {
        return res.status(500).json({ error: 'internal error' });
      }
    }
    default: {
      return res
        .status(501)
        .json({ error: 'requested endpoint does not exist' });
    }
  }
}

export default withAuth(handler);
