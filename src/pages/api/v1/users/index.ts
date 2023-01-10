import { UsersDataType, Method, UserDataType } from '../../../../types';
import { applyUserFilters } from '../../../../utils/filtering/user';
import {
  Collection,
  firestore,
  NextApiRequestWithAuth,
  NextApiResponse,
  withAuth
} from '../../../../utils/firebase/admin';

async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse<UserDataType | UsersDataType | { error: string }>
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

        const params = {
          created: (Array.isArray(req.query.created)
            ? req.query.created[0]
            : req.query.created || 'desc') as FirebaseFirestore.OrderByDirection
        };

        const ids =
          (Array.isArray(req.query.ids) ? req.query.ids[0] : req.query.ids) ??
          '';

        const definedParams = (
          Object.keys(params) as (keyof typeof params)[]
        ).reduce((output, param) => {
          if (!params[param]) return output;
          output.push(param);
          return output;
        }, [] as string[]);

        type Order = [string, FirebaseFirestore.OrderByDirection | undefined];
        const orders: Record<string, Order> = {
          created: ['createdAt', params.created]
        };

        // GET USERS
        // if not filtering by ids, normal query
        if (!ids.length) {
          // prepare query
          let query =
            usersRef as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
          for (const param of definedParams) {
            if (orders[param]) query = query.orderBy(...orders[param]);
          }

          const snapshot = await query.get();
          const users: UsersDataType = [];
          snapshot.forEach((doc) => {
            const user = doc.data() as unknown as UserDataType;
            users.push(user);
          });
          return res.status(200).json(users);
        }

        // if filtering by ids, fetch individualy and sort on server
        if (ids.length) {
          const users: UsersDataType = [];
          for (const id of ids) {
            const userDoc = await usersRef.doc(id).get();
            const user = userDoc.data();
            if (user) users.push(user as UserDataType);
          }

          const filters: Record<string, any> = {};
          for (const param of definedParams) {
            if (orders[param]) filters[param] = orders[param][1];
          }
          const sortedUsers = applyUserFilters(users, filters);

          return res.status(200).json(sortedUsers);
        }

        return res.status(200).json([]);
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
        const { forename, surname, displayName, email } = req.body.data;
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
          forename: forename ?? '',
          surname: surname ?? '',
          about: '',
          image: '',
          garages: [],
          liveries: []
        };

        // if the user already exists, return error
        const doc = await usersRef.doc(user.id).get();
        if (doc.exists) {
          return res.status(409).json({ error: 'user already exists' });
        }

        await usersRef.doc(user.id).set(user);

        try {
          await res.revalidate(`/profile/${req.uid}`);
        } catch (_) {
          // revalidation failing should not cause an error
        }

        return res.status(201).json(user);
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
