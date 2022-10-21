import formidable from 'formidable';
import {
  GarageDataType,
  Method,
  UpdateGarageDataType
} from '../../../../../types';
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
  const userRef = firestore.collection(Collection.USERS);

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
    case Method.PATCH: {
      try {
        // check isAuthenticated
        if (!req.isAuthenticated || !req.uid) {
          return res.status(401).json({ error: 'unauthorized' });
        }
        // check req query
        const id = req.query.id as string | undefined;
        if (!id) {
          return res.status(400).json({ error: 'malformed request params' });
        }

        // parse req body
        const parsedData = await new Promise<UpdateGarageDataType>(
          (resolve, reject) => {
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields, files) => {
              if (err) throw new Error(err);
              try {
                resolve({
                  ...fields,
                  ...files
                } as unknown as UpdateGarageDataType);
              } catch (err) {
                reject(err);
              }
            });
          }
        );

        const { imageFiles, ...data } = parsedData;
        const timestamp = Date.now();
        const garageRef = garagesRef.doc(id);

        // TODO: upload files

        await firestore.runTransaction(async (t) => {
          // get garage
          const garageDoc = await t.get(garageRef);
          const garage = garageDoc.data();

          // only update garage exists and if creator id matches auth user id
          if (!garage || garage.creator.id !== req.uid) {
            throw new Error('unauthorized');
          }

          // update doc
          t.update(garageRef, { ...data, updatedAt: timestamp });
        });

        return res.status(200).json({ id });
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

        const garageRef = garagesRef.doc(params.id);

        firestore.runTransaction(async (t) => {
          const garageDoc = await t.get(garageRef);
          const garage = garageDoc.data() as GarageDataType | undefined;

          // delete if garage exists and only if creator id matches auth user id
          if (!garage || garage.creator.id !== req.uid) {
            throw new Error('unauthorized');
          }

          // remove garage from users
          for (const user of garage.drivers) {
            t.update(userRef.doc(user), {
              garages: FieldValue.arrayRemove(params.id)
            });
          }

          // delete garage
          t.delete(garageRef);
        });

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
