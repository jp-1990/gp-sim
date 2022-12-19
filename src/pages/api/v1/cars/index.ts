import { getCars } from '../../../../lib/car';
import { CarsDataType, Method } from '../../../../types';
import {
  NextApiRequestWithAuth,
  NextApiResponse,
  withAuth
} from '../../../../utils/firebase/admin';

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<CarsDataType | { error: string }>
) {
  const method = req.method;

  switch (method) {
    case Method.GET: {
      const result = await getCars();

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
