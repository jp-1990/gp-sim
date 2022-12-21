import { GarageDataType, GaragesDataType } from '../types';
import { Collection, firestore } from '../utils/firebase/admin';
import data from '../utils/dev-data/garages.json';

export const getGarages = async () => {
  if (process.env.NEXT_PUBLIC_ENABLE_MSW === 'true') {
    return data as GaragesDataType;
  }

  const garagesRef = firestore.collection(Collection.GARAGES);

  const garages = [] as GaragesDataType;

  const garagesSnapshot = await garagesRef.get();
  if (garagesSnapshot.empty) return garages;

  garagesSnapshot.forEach((garage) =>
    garages.push(garage.data() as GarageDataType)
  );

  return garages;
};

export const getGarageById = async (id: string) => {
  if (process.env.NEXT_PUBLIC_ENABLE_MSW === 'true') {
    return data.find((garage) => garage.id === id);
  }

  const garageRef = firestore.collection(Collection.GARAGES).doc(id);

  const garageDoc = await garageRef.get();

  if (!garageDoc.exists) return undefined;

  return garageDoc.data() as GarageDataType;
};
