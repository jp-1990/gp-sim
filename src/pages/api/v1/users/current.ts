import formidable from 'formidable';
import {
  Method,
  UpdateUserProfileDataType,
  UserDataType
} from '../../../../types';
import {
  Collection,
  firestore,
  NextApiRequestWithAuth,
  NextApiResponse,
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
        const parsedData = await new Promise<
          Omit<UpdateUserProfileDataType, 'imageFile'> & {
            imageFile: formidable.File;
            image?: string | null;
          }
        >((resolve, reject) => {
          const form = formidable({ multiples: true });
          form.parse(req, (err, fields, files) => {
            if (err) throw new Error(err);
            try {
              // check req body
              const data = {
                ...fields,
                ...files
              } as unknown as Omit<UpdateUserProfileDataType, 'imageFile'> & {
                imageFile: formidable.File;
              };

              const properties = [
                'about',
                'forename',
                'surname',
                'email',
                'displayName',
                'imageFile'
              ] as const;
              if (Array.isArray(data.imageFile)) {
                return res
                  .status(400)
                  .json({ error: 'malformed request body' });
              }
              for (const key of Object.keys(
                data
              ) as (keyof UpdateUserProfileDataType)[]) {
                if (!properties.includes(key)) {
                  return res
                    .status(400)
                    .json({ error: 'malformed request body' });
                }
              }

              resolve(data);
            } catch (err) {
              reject(err);
            }
          });
        });

        // if no data, return
        if (!Object.keys(parsedData).length) {
          return res.status(200).json({ id: req.uid });
        }

        const creatorUpdateFields: ('displayName' | 'image')[] = [];
        if (parsedData.displayName) creatorUpdateFields.push('displayName');

        // TODO: upload image to storage
        const { imageFile, ...updateData } = parsedData;

        if (imageFile !== null || imageFile !== undefined) {
          // upload image
          // get url
          // set updateData.image
          creatorUpdateFields.push('image');
          updateData.image = imageFile.originalFilename || '';
        }

        // run update transaction
        const currentUserRef = usersRef.doc(req.uid);
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
                if (data.creator[field] !== updateData[field]) {
                  shouldUpdate = true;
                  creatorUpdateData[`creator.${field}`] = updateData[field];
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
                if (data.creator[field] !== updateData[field]) {
                  shouldUpdate = true;
                  creatorUpdateData[`creator.${field}`] = updateData[field];
                }
              }
              if (shouldUpdate) t.update(livery.ref, creatorUpdateData);
            }
          });

          // update user
          t.update(currentUserRef, updateData);
        });

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
