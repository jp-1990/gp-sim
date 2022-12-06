import { CarsDataType } from '../types';
import { Collection, firestore } from '../utils/firebase/admin';

export const getCars = async () => {
  const carsRef = firestore.collection(Collection.CARS);

  const carsDoc = await carsRef.doc('cars').get();
  const cars = carsDoc.data() as { cars: CarsDataType } | undefined;
  const result = cars ? cars.cars : [];

  return result;
};
