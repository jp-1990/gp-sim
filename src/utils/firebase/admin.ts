import { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  });
}

type AuthProperties = {
  uid: string | undefined;
  isAuthenticated: boolean;
};

export type NextApiRequestWithAuth = NextApiRequest & AuthProperties;
export type { NextApiResponse } from 'next';

/*
 * Pass in req and res, and attempt to authenticate the user based on req.headers.token. On error, a 401 error will be sent, otherwise the req will be returned with additonal properties uid and isAuthenticated based on the result of verifying the token.
 */
export const withAuth = (
  handler: (req: NextApiRequest & AuthProperties, res: NextApiResponse) => void
) => {
  return async (req: NextApiRequest & AuthProperties, res: NextApiResponse) => {
    if (!req.headers.token) {
      req.uid = undefined;
      req.isAuthenticated = false;
      return handler(req, res);
    }
    try {
      const { uid }: { uid: string | undefined } = await auth.verifyIdToken(
        req.headers.token as string
      );

      req.uid = uid;
      req.isAuthenticated = !!uid;

      return handler(req, res);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  };
};

const firestore = admin.firestore();
const auth = admin.auth();

export { firestore, auth };
