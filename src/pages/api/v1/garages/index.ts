import formidable from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  CreateGarageDataType,
  GarageDataType,
  GaragesDataType,
  GaragesResponseType,
  Method
} from '../../../../types';
import {
  Collection,
  FieldValue,
  firestore,
  NextApiRequestWithAuth,
  withAuth
} from '../../../../utils/firebase/admin';

//set bodyparser
export const config = {
  api: {
    bodyParser: false
  }
};

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
      try {
        // check isAuthenticated
        if (!req.isAuthenticated || !req.uid) {
          return res.status(401).json({ error: 'unauthorized' });
        }

        // parse req
        const parsedData = await new Promise<CreateGarageDataType>(
          (resolve, reject) => {
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields, files) => {
              if (err) throw new Error(err);
              try {
                // check req body
                const rawData = { ...fields, ...files } as Record<string, any>;
                const properties = [
                  'creator',
                  'description',
                  'imageFiles',
                  'title'
                ] as const;
                for (const property of properties) {
                  if (!rawData.hasOwnProperty(property)) {
                    return res
                      .status(400)
                      .json({ error: 'malformed request body' });
                  }
                }
                rawData.creator = JSON.parse(rawData.creator);

                resolve(rawData as CreateGarageDataType);
              } catch (err) {
                reject(err);
              }
            });
          }
        );

        const { imageFiles, ...data } = parsedData;
        const timestamp = Date.now();
        const newGarageRef = garagesRef.doc();
        const newGarageData: GarageDataType = {
          createdAt: timestamp,
          drivers: [],
          id: newGarageRef.id,
          image: '',
          liveries: [],
          updatedAt: timestamp,
          ...data
        };

        // TODO: upload files

        // batch write create doc, increment count, add to user and garage
        const batch = firestore.batch();
        batch.set(newGarageRef, newGarageData);

        // update user doc
        const userId = newGarageData.creator.id;
        const userRef = firestore.collection(Collection.USERS).doc(userId);
        batch.update(userRef, {
          garages: FieldValue.arrayUnion(newGarageRef.id)
        });

        // run batch
        await batch.commit();

        return res.status(200).json([newGarageData]);
      } catch (err) {
        return res.status(500).json({ error: 'internal error' });
      }
    }
  }
}

export default withAuth(handler);
