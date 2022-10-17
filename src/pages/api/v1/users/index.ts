import { UsersDataType, Method, UserDataType } from '../../../../types';
import {
  Collection,
  firestore,
  NextApiRequestWithAuth,
  NextApiResponse,
  withAuth
} from '../../../../utils/firebase/admin';

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<UsersDataType | { error: string }>
) {
  const method = req.method;
  const usersRef = firestore.collection(Collection.USERS);

  switch (method) {
    case Method.GET: {
      try {
        // check isAuthenticated
        if (!req.isAuthenticated || !req.uid) {
          return res.status(401).json({ error: 'unauthorized' });
        }

        // get users
        const snapshot = await usersRef.get();
        const users: UsersDataType = [];
        snapshot.forEach((doc) => {
          const user = doc.data() as unknown as UserDataType;
          users.push(user);
        });

        return res.status(200).json(users);
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

        // check req body
        const { forename, surname, displayName, email } = req.body;
        if (!displayName || !email) {
          return res.status(400).json({ error: 'malformed request body' });
        }

        // create user
        const user = {
          id: req.uid,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          lastLogin: Date.now(),
          email: email,
          displayName: displayName,
          forename: forename ?? null,
          surname: surname ?? null,
          about: null,
          image: null,
          garages: [],
          liveries: []
        };

        // if the user already exists, return error
        const snapshot = await usersRef.where('id', '==', req.uid).get();
        if (!snapshot.empty) {
          return res.status(409).json({ error: 'user already exists' });
        }

        await usersRef.doc().set(user);

        return res.status(201).json([user]);
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
