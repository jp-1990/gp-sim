import formidable from 'formidable';
import { GarageDataType, Method } from '../../../../../types';
import {
  firestore,
  NextApiResponse,
  NextApiRequestWithAuth,
  Collection,
  withAuth,
  FieldValue
} from '../../../../../utils/firebase/admin';

//set bodyparser
export const config = {
  api: {
    bodyParser: false
  }
};

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<string[] | { [key: string]: string }>
) {
  const method = req.method;
  const garagesRef = firestore.collection(Collection.GARAGES);

  switch (method) {
    case Method.PATCH: {
      try {
        // check isAuthenticated
        if (!req.isAuthenticated || !req.uid) {
          return res.status(401).json({ error: 'unauthorized' });
        }
        // check req params
        const garageId = req.query.id as string | undefined;
        if (!garageId) {
          return res.status(400).json({ error: 'malformed request params' });
        }

        // parse req body
        const { ids } = await new Promise<{ ids: string[] }>(
          (resolve, reject) => {
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields) => {
              if (err) throw new Error(err);
              try {
                // check req body
                const rawData = { ...fields } as Record<string, any>;
                const properties = ['ids'] as const;
                for (const property of properties) {
                  if (!rawData.hasOwnProperty(property)) {
                    return res
                      .status(400)
                      .json({ error: 'malformed request body' });
                  }
                }
                rawData.ids = rawData.ids.split(',');

                resolve(rawData as { ids: string[] });
              } catch (err) {
                reject(err);
              }
            });
          }
        );

        const garageRef = garagesRef.doc(garageId);
        await firestore.runTransaction(async (t) => {
          const garageDoc = await t.get(garageRef);
          const garage = garageDoc.data() as GarageDataType | undefined;

          // only update garage exists and if creator id matches auth user id
          if (!garage || garage.creator.id !== req.uid) {
            throw new Error('unauthorized');
          }

          // add liveries to garage
          t.update(garageRef, { liveries: FieldValue.arrayUnion(...ids) });
        });

        return res.status(200).json(ids);
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
        const garageId = req.query.id as string | undefined;
        if (!garageId) {
          return res.status(400).json({ error: 'malformed request params' });
        }
        // parse req body
        const { ids } = await new Promise<{ ids: string[] }>(
          (resolve, reject) => {
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields) => {
              if (err) throw new Error(err);
              try {
                // check req body
                const rawData = { ...fields } as Record<string, any>;
                const properties = ['ids'] as const;
                for (const property of properties) {
                  if (!rawData.hasOwnProperty(property)) {
                    return res
                      .status(400)
                      .json({ error: 'malformed request body' });
                  }
                }
                rawData.ids = rawData.ids.split(',');

                resolve(rawData as { ids: string[] });
              } catch (err) {
                reject(err);
              }
            });
          }
        );

        const garageRef = garagesRef.doc(garageId);
        await firestore.runTransaction(async (t) => {
          const garageDoc = await t.get(garageRef);
          const garage = garageDoc.data() as GarageDataType | undefined;

          // only delete if garage exists and if creator id matches auth user id
          if (!garage || garage.creator.id !== req.uid) {
            throw new Error('unauthorized');
          }

          // remove liveries from garage
          t.update(garageRef, { liveries: FieldValue.arrayRemove(...ids) });
        });

        return res.status(200).json(ids);
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
