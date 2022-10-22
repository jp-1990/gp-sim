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

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<UserDataType | { id: string } | { error: string }>
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

        // check req body
        const data = req.body as UpdateUserProfileDataType;
        const properties = [
          'about',
          'forename',
          'surname',
          'displayName',
          'email',
          'imageFiles'
        ] as const;
        for (const property of properties) {
          if (!Object.prototype.hasOwnProperty.call(data, property)) {
            return res.status(400).json({ error: 'malformed request body' });
          }
        }

        // get user by id
        const currentUserRef = usersRef.doc(req.uid);
        const userDoc = await currentUserRef.get();
        const user = userDoc.data() as UserDataType | undefined;

        if (!user) {
          return res.status(404).json({ error: 'not found' });
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
        const newImage = data.imageFiles;
        if (newImage) {
          // upload image
          // get url
          // set updateData.image
        }

        await currentUserRef.update(updateData);

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
