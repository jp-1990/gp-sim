import { Method, PublicUserDataType, UserDataType } from '../../../../types';
import {
  withAuth,
  NextApiRequestWithAuth,
  NextApiResponse,
  firestore,
  Collection
} from '../../../../utils/firebase/admin';

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<PublicUserDataType | { error: string }>
) {
  const method = req.method;
  const usersRef = firestore.collection(Collection.USERS);

  switch (method) {
    case Method.GET: {
      try {
        // check req params
        const params = {
          id: req.query.id as string | undefined
        };

        if (!params.id) {
          return res.status(400).json({ error: 'malformed request params' });
        }

        // get user by id
        const userDoc = await usersRef.doc(params.id).get();
        const user = userDoc.data() as UserDataType | undefined;

        if (!user) {
          return res.status(404).json({ error: 'not found' });
        }

        const { id, about, displayName, liveries, image } = user;
        const publicUser = { id, about, displayName, liveries, image };

        return res.status(200).json(publicUser);
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
