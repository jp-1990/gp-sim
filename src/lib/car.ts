import { CarsDataType } from '../types';
import { Collection, firestore } from '../utils/firebase/admin';
import data from '../utils/dev-data/cars.json';

export const getCars = async (): Promise<CarsDataType> => {
  return data as any;
};

// export const getCars = async () => {
//   const carsRef = firestore.collection(Collection.CARS);

//   const carsDoc = await carsRef.doc('cars').get();
//   const cars = carsDoc.data() as { cars: CarsDataType } | undefined;
//   const result = cars ? cars.cars : [];

//   return result;
// };
