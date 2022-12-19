import { UserDataType, UsersDataType } from '../types';
import { Collection, firestore } from '../utils/firebase/admin';
import data from '../utils/dev-data/users.json';

export const getUsers = async (): Promise<UsersDataType> => {
  return data as any;
};

export const getUserById = async (
  id: string
): Promise<UserDataType | undefined> => {
  return data.find((user) => user.id === id);
};

// export const getUsers = async () => {
//   const usersRef = firestore.collection(Collection.USERS);

//   const users = [] as UsersDataType;

//   const usersSnapshot = await usersRef.get();
//   if (usersSnapshot.empty) return users;

//   usersSnapshot.forEach((user) => users.push(user.data() as UserDataType));

//   return users;
// };

// export const getUserById = async (id: string) => {
//   const userRef = firestore.collection(Collection.USERS).doc(id);

//   const userDoc = await userRef.get();

//   if (!userDoc.exists) return undefined;

//   return userDoc.data() as UserDataType;
// };
