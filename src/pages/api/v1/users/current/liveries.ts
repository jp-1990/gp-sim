import formidable from 'formidable';
import { Method, UserDataType } from '../../../../../types';
import { validateObject } from '../../../../../utils/api/uploads';
import {
  Collection,
  FieldValue,
  firestore,
  NextApiRequestWithAuth,
  NextApiResponse,
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

  switch (method) {
    case Method.PATCH: {
      try {
        // check isAuthenticated
        if (!req.isAuthenticated || !req.uid) {
          return res.status(401).json({ error: 'unauthorized' });
        }

        // parse req body
        const parsedData = await new Promise<Pick<UserDataType, 'liveries'>>(
          (resolve, reject) => {
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields, _files) => {
              if (err) throw new Error(err);
              try {
                // check req body
                const data = {
                  ...fields
                } as unknown as Pick<UserDataType, 'liveries'>;

                const isValid = validateObject(data, ['liveries']);
                if (!isValid)
                  return res
                    .status(400)
                    .json({ error: 'malformed request body' });

                resolve(data);
              } catch (err) {
                reject(err);
              }
            });
          }
        );

        const parsedDataKeys = Object.keys(parsedData);

        // if no update data, return
        if (!parsedDataKeys.length) {
          return res.status(200).json({ id: req.uid });
        }

        // run update transaction
        const currentUserRef = usersRef.doc(req.uid);
        try {
          await firestore.runTransaction(async (t) => {
            // update user
            t.update(currentUserRef, {
              liveries: FieldValue.arrayUnion(...parsedData.liveries)
            });
          });
        } catch (err: any) {
          throw new Error(err);
        }

        try {
          await res.revalidate(`/profile/${req.uid}`);
        } catch (_) {
          // revalidation failing should not cause an error
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
