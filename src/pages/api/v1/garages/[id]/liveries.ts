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
  res: NextApiResponse<GarageDataType | { [key: string]: string }>
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
        const parsedData = await new Promise<{
          liveriesToAdd?: string[];
          liveriesToRemove?: string[];
        }>((resolve, reject) => {
          const form = formidable({ multiples: true });
          form.parse(req, (err, fields) => {
            if (err) throw new Error(err);
            try {
              const rawData = { ...fields } as Record<string, any>;

              const data = {} as {
                liveriesToAdd?: string[];
                liveriesToRemove?: string[];
              };
              if (rawData.liveriesToRemove)
                data.liveriesToRemove = JSON.parse(rawData.liveriesToRemove);
              if (rawData.liveriesToAdd)
                data.liveriesToAdd = JSON.parse(rawData.liveriesToAdd);

              resolve(data);
            } catch (err) {
              reject(err);
            }
          });
        });

        const timestamp = Date.now();
        const garageRef = garagesRef.doc(garageId);

        const updatedGarage = await firestore.runTransaction(async (t) => {
          const garageDoc = await t.get(garageRef);
          const garage = garageDoc.data() as GarageDataType | undefined;

          // only update if garage exists and if creator id matches auth user id
          if (!garage || garage.creator.id !== req.uid) {
            throw new Error('unauthorized');
          }

          const updatedLiveries = [...garage.liveries];

          // add liveries to garage
          if (parsedData.liveriesToAdd?.length) {
            t.update(garageRef, {
              liveries: FieldValue.arrayUnion(...parsedData.liveriesToAdd)
            });
            updatedLiveries.push(...parsedData.liveriesToAdd);
          }

          // remove liveries from garage
          if (parsedData.liveriesToRemove?.length) {
            t.update(garageRef, {
              liveries: FieldValue.arrayRemove(...parsedData.liveriesToRemove)
            });
            updatedLiveries.filter(
              (id) => !parsedData.liveriesToRemove?.includes(id)
            );
          }

          return { ...garage, liveries: updatedLiveries, updatedAt: timestamp };
        });

        return res.status(200).json(updatedGarage);
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
