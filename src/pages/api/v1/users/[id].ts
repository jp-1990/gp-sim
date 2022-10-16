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
  res: NextApiResponse<PublicUserDataType[] | { error: string }>
) {
  const method = req.method;
  const query = req.query;
  const usersRef = firestore.collection(Collection.USERS);

  switch (method) {
    case Method.GET: {
      // get user by id
      const snapshot = await usersRef.where('id', '==', query.id).get();
      const users: PublicUserDataType[] = [];
      snapshot.forEach((doc) => {
        const { id, about, displayName, liveries, image } =
          doc.data() as unknown as UserDataType;
        users.push({ id, about, displayName, liveries, image });
      });

      return res.status(200).json(users);
    }
    default: {
      return res
        .status(501)
        .json({ error: 'requested endpoint does not exist' });
    }
  }
}

export default withAuth(handler);
