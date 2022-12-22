import { UserDataType, UsersDataType } from '../types';
import { Collection, firestore } from '../utils/firebase/admin';
import data from '../utils/dev-data/users.json';

const getUsers = async () => {
  if (process.env.NEXT_PUBLIC_ENABLE_MSW === 'true') {
    return data as UsersDataType;
  }

  const usersRef = firestore.collection(Collection.USERS);

  const users = [] as UsersDataType;

  const usersSnapshot = await usersRef.get();
  if (usersSnapshot.empty) return users;

  usersSnapshot.forEach((user) => users.push(user.data() as UserDataType));

  return users;
};

const getUserById = async (id: string) => {
  if (process.env.NEXT_PUBLIC_ENABLE_MSW === 'true') {
    return data.find((user) => user.id === id);
  }

  const userRef = firestore.collection(Collection.USERS).doc(id);

  const userDoc = await userRef.get();

  if (!userDoc.exists) return undefined;

  return userDoc.data() as UserDataType;
};

const functions = { getUsers, getUserById };
export default functions;
