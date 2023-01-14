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
import {
  isNotNullish,
  parseStringBoolean
} from '../../../../../utils/functions';

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

        const userId = req.uid;
        const userRef = usersRef.doc(userId);
        const currentUser = (await userRef.get()).data() as UserDataType;
        if (!currentUser) return res.status(404).json({ error: 'not found' });

        // parse req
        const files: UploadFiles = {};
        const parsedData = await new Promise<
          Omit<UpdateUserProfileDataType, 'imageFile'> & {
            image?: string;
            removeImage?: boolean;
          }
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
              } as any;

              const isValid = validateObject(
                data,
                [
                  'about',
                  'forename',
                  'surname',
                  'email',
                  'displayName',
                  'removeImage'
                ],
                'partial'
              );
              if (!isValid)
                return res
                  .status(400)
                  .json({ error: 'malformed request body' });
              for (const key of Object.keys(data)) {
                if (data[key] === 'undefined') data[key] = undefined;
              }
              data.removeImage = parseStringBoolean(data.removeImage);

              resolve(data);
            } catch (err) {
              reject(err);
            }
          });
        });

        const { removeImage, ...data } = parsedData;

        const timestamp = Date.now();
        const updateProfileData: Partial<
          Omit<
            UserDataType,
            'id' | 'createdAt' | 'lastLogin' | 'garages' | 'liveries'
          >
        > = {
          updatedAt: timestamp
        };
        const creatorUpdateData: Record<string, string> = {};

        // if a key has a value, add to updateData
        for (const key of Object.keys(data)) {
          const updateValue = data[key as keyof typeof data];
          if (isNotNullish(updateValue)) {
            if (key === 'displayName') {
              creatorUpdateData[`creator.${key}`] = updateValue as string;
            }
            updateProfileData[key as keyof typeof data] = updateValue as string;
          }
        }

        if (removeImage) {
          updateProfileData.image = '';
          creatorUpdateData[`creator.image`] = '';
        }

        const filenames = Object.keys(files);
        const parsedDataKeys = Object.keys(parsedData);

        // if no update data, return
        if (!filenames.length && !parsedDataKeys.length) {
          return res.status(200).json(currentUser);
        }

        // clear bucket path
        const bucket = storage.bucket();
        if (removeImage) {
          await bucket.deleteFiles({
            prefix: `${StoragePath.USERS}${userId}`
          });
        }

        // upload image to storage
        let file;
        for (const filename of filenames) {
          if (files[filename].stream && files[filename].filename) {
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

            updateProfileData.image = url;
            creatorUpdateData['creator.image'] = url;
          }
        }

        // run update transaction
        try {
          await firestore.runTransaction(async (t) => {
            if (Object.keys(creatorUpdateData).length) {
              for (const garage of currentUser.garages) {
                t.update(garagesRef.doc(garage), creatorUpdateData);
              }

              for (const livery of currentUser.liveries) {
                t.update(liveriesRef.doc(livery), creatorUpdateData);
              }
            }

            // update user
            t.update(userRef, updateProfileData);
          });

          try {
            await res.revalidate(`/profile/${userId}`);
            if (currentUser.garages.length) {
              await res.revalidate(`/garages`);
              for (const garageId of currentUser.garages) {
                await res.revalidate(`/garages/${garageId}`);
              }
            }
            if (currentUser.liveries.length) {
              await res.revalidate(`/liveries`);
              for (const liveryId of currentUser.liveries) {
                await res.revalidate(`/liveries/${liveryId}`);
              }
            }
          } catch (_) {
            // revalidation failing should not cause an error
          }
        } catch (err: any) {
          await file?.delete();
          throw new Error(err);
        }

        const updatedUser = {
          ...currentUser,
          ...updateProfileData
        };

        return res.status(200).json(updatedUser);
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
