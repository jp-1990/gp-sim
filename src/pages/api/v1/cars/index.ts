import { CarsDataType, Method } from '../../../../types';
import {
  Collection,
  firestore,
  NextApiRequestWithAuth,
  NextApiResponse,
  withAuth
} from '../../../../utils/firebase/admin';

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<CarsDataType | { error: string }>
) {
  const method = req.method;
  const carsRef = firestore.collection(Collection.CARS);

  switch (method) {
    case Method.GET: {
      const carsDoc = await carsRef.doc('cars').get();
      const cars = carsDoc.data() as { cars: CarsDataType } | undefined;
      const result = cars ? cars.cars : [];

      return res.status(200).json(result);
    }
    default: {
      return res
        .status(501)
        .json({ error: 'requested endpoint does not exist' });
    }
  }
}
export default withAuth(handler);
