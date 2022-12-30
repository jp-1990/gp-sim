import { GarageDataType, Method } from '../../../../../types';
import {
  firestore,
  NextApiResponse,
  NextApiRequestWithAuth,
  Collection,
  withAuth,
  FieldValue
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
  const usersRef = firestore.collection(Collection.USERS);

  switch (method) {
    case Method.POST: {
      try {
        // check isAuthenticated
        if (!req.isAuthenticated || !req.uid) {
          return res.status(401).json({ error: 'unauthorized' });
        }
        const userId = req.uid;

        // check req params
        const params = {
          id: req.query.id as string | undefined
        };
        const garageId = params.id;

        if (!garageId) {
          return res.status(400).json({ error: 'malformed request params' });
        }

        // find target garage
        const garageRef = garagesRef.doc(garageId);
        const garageDoc = await garageRef.get();
        const garageExists = garageDoc.exists;
        const garage = garageDoc.data() as GarageDataType;

        // if garage exists add it to user, and add user to garage
        if (garageExists) {
          const userRef = usersRef.doc(userId);
          const userExists = (await userRef.get()).exists;
          if (!userExists) throw new Error('user does not exist');

          const updateUser = userRef.update({
            garages: FieldValue.arrayUnion(garageId)
          });
          const updateGarage = garageRef.update({
            drivers: FieldValue.arrayUnion(userId)
          });

          await Promise.all([updateUser, updateGarage]);

          garage.drivers = [...new Set([...garage.drivers, userId])];
          return res.status(200).json(garage);
        }

        try {
          await res.revalidate(`/garages/${garageId}`);
          await res.revalidate(`/profile/${userId}`);
        } catch (_) {
          // revalidation failing should not cause an error
        }

        return res.status(404).json({ error: 'garage not found' });
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
