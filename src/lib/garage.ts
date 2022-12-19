import { GarageDataType, GaragesDataType } from '../types';
import { Collection, firestore } from '../utils/firebase/admin';
import data from '../utils/dev-data/garages.json';

export const getGarages = async (): Promise<GaragesDataType> => {
  return data as any;
};

export const getGarageById = async (
  id: string
): Promise<GarageDataType | undefined> => {
  return data.find((garage) => garage.id === id);
};

// export const getGarages = async () => {
//   const garagesRef = firestore.collection(Collection.GARAGES);

//   const garages = [] as GaragesDataType;

//   const garagesSnapshot = await garagesRef.get();
//   if (garagesSnapshot.empty) return garages;

//   garagesSnapshot.forEach((garage) =>
//     garages.push(garage.data() as GarageDataType)
//   );

//   return garages;
// };

// export const getGarageById = async (id: string) => {
//   const garageRef = firestore.collection(Collection.GARAGES).doc(id);

//   const garageDoc = await garageRef.get();

//   if (!garageDoc.exists) return undefined;

//   return garageDoc.data() as GarageDataType;
// };
