import formidable from 'formidable';
import { PassThrough } from 'stream';
import { pipeline } from 'stream/promises';
import {
  GarageDataType,
  Method,
  UpdateGarageDataType
} from '../../../../../types';
import { defaultGarageImageTransform } from '../../../../../utils/api/images';
import {
  customOnFormidablePart,
  UploadFiles,
  validateObject
} from '../../../../../utils/api/uploads';
import {
  firestore,
  NextApiResponse,
  NextApiRequestWithAuth,
  Collection,
  withAuth,
  FieldValue,
  storage,
  StoragePath
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

  const bucket = storage.bucket();

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
        const files: UploadFiles = {};
        const parsedData = await new Promise<
          Omit<UpdateGarageDataType, 'id'> & { image?: string }
        >((resolve, reject) => {
          const form = formidable({ multiples: true });
          form.onPart = customOnFormidablePart(files, form, [
            { name: 'imageFile', limit: 1 }
          ]);
          form.parse(req, (err, fields, _files) => {
            if (err) throw new Error(err);
            try {
              // check req body
              const data = {
                ...fields
              } as unknown as Omit<UpdateGarageDataType, 'imageFile' | 'id'>;

              const isValid = validateObject(data, ['title', 'description']);
              if (!isValid)
                return res
                  .status(400)
                  .json({ error: 'malformed request body' });

              resolve(data);
            } catch (err) {
              reject(err);
            }
          });
        });

        const filenames = Object.keys(files);
        const parsedDataKeys = Object.keys(parsedData);

        // if no update data, return
        if (!filenames.length && !parsedDataKeys.length) {
          return res.status(200).json({ id });
        }

        // upload image to storage
        let file;
        for (const filename of filenames) {
          if (files[filename].stream && files[filename].filename) {
            await bucket.deleteFiles({
              prefix: `${StoragePath.GARAGES}${id}`
            });
            file = bucket.file(`${StoragePath.GARAGES}${id}`);

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
            parsedData.image = url;
          }
        }

        const timestamp = Date.now();
        const garageRef = garagesRef.doc(id);

        try {
          const updatedGarage = await firestore.runTransaction(async (t) => {
            // get garage
            const garageDoc = await t.get(garageRef);
            const garage = garageDoc.data();

            // only update garage exists and if creator id matches auth user id
            if (!garage || garage.creator.id !== req.uid) {
              throw new Error('unauthorized');
            }

            // abort update if nothing has changed
            const shouldUpdate = parsedDataKeys.some(
              (key) =>
                parsedData[key as keyof typeof parsedData] !== garage[key]
            );
            if (!shouldUpdate) return garage;

            // update doc
            t.update(garageRef, { ...parsedData, updatedAt: timestamp });

            return { ...garage, ...parsedData, updatedAt: timestamp };
          });

          return res.status(200).json(updatedGarage);
        } catch (err: any) {
          await file?.delete();
          throw new Error(err);
        }
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

        await firestore.runTransaction(async (t) => {
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

        await bucket.deleteFiles({
          prefix: `${StoragePath.GARAGES}${params.id}/`
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
