import { LiveriesDataType, LiveryDataType, Method } from '../../../../types';
import {
  firestore,
  NextApiResponse,
  NextApiRequestWithAuth,
  Collection,
  Document,
  withAuth,
  CountShards,
  FieldValue
} from '../../../../utils/firebase/admin';

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<LiveryDataType | { [key: string]: string }>
) {
  const method = req.method;
  const liveriesRef = firestore.collection(Collection.LIVERIES);
  const garagesRef = firestore.collection(Collection.GARAGES);
  const countRef = firestore.collection(Collection.COUNT);

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
    // TODO: decide on update logic

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

        const garageIdsToRevalidate = await firestore.runTransaction(
          async (t) => {
            // get livery
            const liveryDoc = await t.get(liveryRef);
            const livery = liveryDoc.data() as LiveryDataType | undefined;

            // delete only if creator id matches auth user id, and livery exists
            if (!livery || livery.creator.id !== req.uid) {
              throw new Error('unauthorized');
            }

            // decrement count on random shard
            const shardId = Math.floor(Math.random() * CountShards.LIVERY);
            const shardRef = countRef
              .doc(Document.LIVERY)
              .collection('shards')
              .doc(shardId.toString());
            t.update(shardRef, { count: FieldValue.increment(-1) });

            // mark livery as deleted
            t.update(liveryRef, { deleted: true });

            // get ids for garages that this livery belongs to
            const garageIds: string[] = [];
            const garagesSnapshot = await t.get(
              garagesRef.where(livery.id, 'in', 'liveries')
            );
            garagesSnapshot.forEach((doc) => {
              garageIds.push(doc.data().id);
            });

            return garageIds;
          }
        );

        try {
          await res.revalidate('/liveries');
          await res.revalidate(`/liveries/${params.id}`);
          await res.revalidate(`/profile/${req.uid}`);
          for (const id of garageIdsToRevalidate) {
            await res.revalidate(`/garages/${id}`);
          }
        } catch (_) {
          // revalidation failing should not cause an error
        }

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
