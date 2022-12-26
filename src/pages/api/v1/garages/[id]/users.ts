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
  const usersRef = firestore.collection(Collection.USERS);

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
          usersToAdd?: string[];
          usersToRemove?: string[];
        }>((resolve, reject) => {
          const form = formidable({ multiples: true });
          form.parse(req, (err, fields) => {
            if (err) throw new Error(err);
            try {
              const rawData = { ...fields } as Record<string, any>;

              const data = {} as {
                usersToAdd?: string[];
                usersToRemove?: string[];
              };
              if (rawData.usersToRemove)
                data.usersToRemove = JSON.parse(rawData.usersToRemove);
              if (rawData.usersToAdd)
                data.usersToAdd = JSON.parse(rawData.usersToAdd);

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

          // only update garage exists and if creator id matches auth user id
          if (!garage || garage.creator.id !== req.uid) {
            throw new Error('unauthorized');
          }

          const updatedUsers = [...garage.drivers];

          if (parsedData.usersToAdd?.length) {
            // add users to garage
            t.update(garageRef, {
              drivers: FieldValue.arrayUnion(...parsedData.usersToAdd)
            });
            updatedUsers.push(...parsedData.usersToAdd);

            // add garage to users
            for (const user of parsedData.usersToAdd) {
              t.update(usersRef.doc(user), {
                garages: FieldValue.arrayUnion(garage.id)
              });
            }
          }

          if (parsedData.usersToRemove?.length) {
            // cannot remove creator from garage
            const usersToRemove = parsedData.usersToRemove.filter(
              (id) => id !== garage.creator.id
            );

            // remove users from garage
            t.update(garageRef, {
              drivers: FieldValue.arrayRemove(usersToRemove)
            });
            updatedUsers.filter((id) => !usersToRemove.includes(id));

            // remove garage from users
            for (const user of usersToRemove) {
              t.update(usersRef.doc(user), {
                garages: FieldValue.arrayRemove(garage.id)
              });
            }
          }

          return { ...garage, drivers: updatedUsers, updatedAt: timestamp };
        });

        try {
          await res.revalidate(`/garages/${garageId}`);
        } catch (_) {
          // revalidation failing should not cause an error
        }

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
