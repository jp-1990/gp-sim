import {
  Method,
  UpdateUserProfileDataType,
  UserDataType,
  UsersDataType
} from '../../../../types';
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

        // get user by id
        const currentUserId = req.uid;
        const snapshot = await usersRef.where('id', '==', currentUserId).get();

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
    case Method.PATCH: {
      try {
        // check isAuthenticated
        if (!req.isAuthenticated || !req.uid) {
          return res.status(401).json({ error: 'unauthorized' });
        }

        // check req body
        const data = req.body as UpdateUserProfileDataType;
        const properties = [
          'about',
          'forename',
          'surname',
          'displayName',
          'email',
          'image'
        ] as const;
        for (const property of properties) {
          if (!data.hasOwnProperty(property)) {
            return res.status(400).json({ error: 'malformed request body' });
          }
        }

        // get users by id (should only return 1)
        const snapshot = await usersRef.where('id', '==', req.uid).get();
        if (snapshot.empty) {
          return res.status(404).json({ error: 'user does not exist' });
        }

        const userRefs: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>[] =
          [];
        snapshot.forEach((doc) => userRefs.push(doc.ref));
        if (userRefs.length > 1) {
          return res.status(500).json({ error: 'internal error' });
        }

        const updateData = {
          about: data.about,
          displayName: data.displayName,
          email: data.email,
          forename: data.forename,
          surname: data.surname
        };

        // TODO: update anywhere else the user is stored (e.g. livery created by user)

        // TODO: upload image to storage
        const newImage = data.image;
        if (newImage) {
          // upload image
          // get url
          // set updateData.image
        }

        const currentUserRef = userRefs[0];
        await currentUserRef.update(updateData);

        return res.status(200).json([]);
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
