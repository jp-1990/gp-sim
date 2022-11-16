import formidable from 'formidable';
import { PassThrough } from 'stream';
import { pipeline } from 'stream/promises';
import {
  Method,
  UpdateUserProfileDataType,
  UserDataType
} from '../../../../../types';
import { defaultUserImageTransform } from '../../../../../utils/api/images';
import {
  customOnFormidablePart,
  UploadFiles,
  validateObject
} from '../../../../../utils/api/uploads';
import {
  Collection,
  firestore,
  NextApiRequestWithAuth,
  NextApiResponse,
  storage,
  StoragePath,
  withAuth
} from '../../../../../utils/firebase/admin';

//set bodyparser
export const config = {
  api: {
    bodyParser: false
  }
};

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<UserDataType | { id: string } | { error: string }>
) {
  const method = req.method;
  const usersRef = firestore.collection(Collection.USERS);
  const garagesRef = firestore.collection(Collection.GARAGES);
  const liveriesRef = firestore.collection(Collection.LIVERIES);

  switch (method) {
    case Method.GET: {
      try {
        // check isAuthenticated
        if (!req.isAuthenticated || !req.uid) {
          return res.status(401).json({ error: 'unauthorized' });
        }

        // get user by id
        const userDoc = await usersRef.doc(req.uid).get();
        const user = userDoc.data() as UserDataType | undefined;

        if (!user) {
          return res.status(404).json({ error: 'not found' });
        }

        return res.status(200).json(user);
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

        // parse req body
        const files: UploadFiles = {};
        const parsedData = await new Promise<
          Omit<UpdateUserProfileDataType, 'imageFile'> & { image?: string }
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
              } as unknown as Omit<UpdateUserProfileDataType, 'imageFile'>;

              const isValid = validateObject(data, [
                'about',
                'forename',
                'surname',
                'email',
                'displayName'
              ]);
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
          return res.status(200).json({ id: req.uid });
        }

        // upload image to storage
        let file;
        for (const filename of filenames) {
          if (files[filename].stream && files[filename].filename) {
            const bucket = storage.bucket();
            await bucket.deleteFiles({
              prefix: `${StoragePath.USERS}${req.uid}/`
            });
            file = bucket.file(`${StoragePath.USERS}${req.uid}/${Date.now()}`);

            const fileWriteStream = file.createWriteStream({
              contentType: 'image/webp'
            });
            const sharpTransformStream = defaultUserImageTransform();

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

        const creatorUpdateFields: ('displayName' | 'image')[] = [];
        if (parsedData.displayName) creatorUpdateFields.push('displayName');
        if (parsedData.image) creatorUpdateFields.push('image');

        // run update transaction
        const currentUserRef = usersRef.doc(req.uid);
        try {
          await firestore.runTransaction(async (t) => {
            // get user
            const userDoc = await t.get(currentUserRef);
            const user = userDoc.data() as UserDataType | undefined;

            if (!user) throw new Error('not found');

            const garagesSnapshot = await t.get(
              garagesRef.where('id', 'in', user.garages)
            );
            const liveriesSnapshot = await t.get(
              liveriesRef.where('id', 'in', user.liveries)
            );

            // update garages where user is the creator
            garagesSnapshot.forEach((garage) => {
              const data = garage.data();
              if (data.creator.id === user.id) {
                const creatorUpdateData: Record<string, any> = {};
                let shouldUpdate = false;
                for (const field of creatorUpdateFields) {
                  if (data.creator[field] !== parsedData[field]) {
                    shouldUpdate = true;
                    creatorUpdateData[`creator.${field}`] = parsedData[field];
                  }
                }
                if (shouldUpdate) t.update(garage.ref, creatorUpdateData);
              }
            });

            // update liveries where user is the creator
            liveriesSnapshot.forEach((livery) => {
              const data = livery.data();
              if (data.creator.id === user.id) {
                const creatorUpdateData: Record<string, any> = {};
                let shouldUpdate = false;
                for (const field of creatorUpdateFields) {
                  if (data.creator[field] !== parsedData[field]) {
                    shouldUpdate = true;
                    creatorUpdateData[`creator.${field}`] = parsedData[field];
                  }
                }
                if (shouldUpdate) t.update(livery.ref, creatorUpdateData);
              }
            });

            // update user
            t.update(currentUserRef, parsedData);
          });
        } catch (err: any) {
          await file?.delete();
          throw new Error(err);
        }

        return res.status(200).json({ id: req.uid });
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
