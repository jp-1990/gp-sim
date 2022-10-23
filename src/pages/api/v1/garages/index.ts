import formidable from 'formidable';
import { PassThrough } from 'stream';
import { pipeline } from 'stream/promises';
import {
  CreateGarageDataType,
  GarageDataType,
  GaragesDataType,
  GaragesResponseType,
  Method
} from '../../../../types';
import { defaultGarageImageTransform } from '../../../../utils/api/images';
import {
  customOnFormidablePart,
  UploadFiles
} from '../../../../utils/api/uploads';
import {
  Collection,
  FieldValue,
  firestore,
  NextApiRequestWithAuth,
  NextApiResponse,
  storage,
  StoragePath,
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
        // TODO: FILTERING LOGIC
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
        const files: UploadFiles = {};
        const parsedData = await new Promise<CreateGarageDataType>(
          (resolve, reject) => {
            const form = formidable({ multiples: true });
            form.onPart = customOnFormidablePart(files, form, 'imageFile', 1);
            form.parse(req, (err, fields, _files) => {
              if (err) throw new Error(err);
              try {
                // check req body
                const properties = ['creator', 'description', 'title'] as const;
                for (const property of properties) {
                  if (!Object.prototype.hasOwnProperty.call(fields, property)) {
                    return res
                      .status(400)
                      .json({ error: 'malformed request body' });
                  }
                }
                const rawData = {
                  ...fields
                } as unknown as CreateGarageDataType;
                rawData.creator = JSON.parse(fields.creator as string);

                resolve(rawData);
              } catch (err) {
                reject(err);
              }
            });
          }
        );

        const timestamp = Date.now();
        const newGarageRef = garagesRef.doc();
        const newGarageData: GarageDataType = {
          createdAt: timestamp,
          drivers: [req.uid],
          id: newGarageRef.id,
          image: '',
          liveries: [],
          updatedAt: timestamp,
          ...parsedData
        };

        // upload image to storage
        const filenames = Object.keys(files);
        for (const filename of filenames) {
          if (files[filename].stream && files[filename].filename) {
            const bucket = storage.bucket();
            const file = bucket.file(
              `${StoragePath.GARAGES}${newGarageRef.id}`
            );

            const fileWriteStream = file.createWriteStream({
              contentType: 'image/webp'
            });
            const sharpTransformStream = defaultGarageImageTransform();

            await pipeline(
              files[filename].stream as PassThrough,
              sharpTransformStream,
              fileWriteStream
            );

            await file.makePublic();
            const url = file.publicUrl();
            newGarageData.image = url;
          }
        }

        // batch write create doc, add to user
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
    default: {
      return res
        .status(501)
        .json({ error: 'requested endpoint does not exist' });
    }
  }
}

export default withAuth(handler);
