import { Method } from '../../../../../types';
import {
  firestore,
  NextApiResponse,
  NextApiRequestWithAuth,
  Collection,
  withAuth,
  storage,
  StoragePath,
  FieldValue
} from '../../../../../utils/firebase/admin';

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<string | { [key: string]: string }>
) {
  const method = req.method;

  const usersRef = firestore.collection(Collection.USERS);
  const liveriesRef = firestore.collection(Collection.LIVERIES);

  switch (method) {
    case Method.GET: {
      try {
        // check isAuthenticated
        if (!req.isAuthenticated || !req.uid) {
          return res.status(401).json({ error: 'unauthorized' });
        }
        const uid = req.uid;

        // check req params
        const params = {
          id: req.query.id as string | undefined
        };

        if (!params.id) {
          return res.status(400).json({ error: 'malformed request params' });
        }
        const liveryId = params.id;

        // check that the authenticated user owns this livery
        const userDoc = await usersRef.doc(uid).get();
        const user = userDoc.data();

        if (!user || (user && !user.liveries.includes(liveryId))) {
          return res.status(401).json({ error: 'unauthorized' });
        }

        // get download url for livery
        const bucket = storage.bucket();
        const filePath = `${StoragePath.LIVERIES}${liveryId}/zip/${liveryId}`;
        const file = bucket.file(filePath);

        const url = file.publicUrl();

        // increment downloads on livery
        try {
          await liveriesRef
            .doc(liveryId)
            .update({ downloads: FieldValue.increment(1) });
        } catch (_) {
          // error here should not cause the main operation to fail, and is largely irrelevant unless it happens often
        }

        try {
          await res.revalidate(`/liveries/${liveryId}`);
        } catch (_) {
          // revalidation failing should not cause an error
        }

        return res.status(200).json(url);
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
