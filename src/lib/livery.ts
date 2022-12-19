import { LiveriesDataType, LiveryDataType } from '../types';
import { Collection, firestore } from '../utils/firebase/admin';
import data from '../utils/dev-data/liveries.json';

export const getLiveries = async (): Promise<LiveriesDataType> => {
  return data as any;
};

export const getLiveryById = async (
  id: string
): Promise<LiveryDataType | undefined> => {
  const livery = data.find((livery) => livery.id === id);
  if (!livery) return undefined;

  return { ...livery, deleted: false };
};

// export const getLiveries = async () => {
//   const liveriesRef = firestore.collection(Collection.LIVERIES);

//   const liveries = [] as LiveriesDataType;

//   const liveriesSnapshot = await liveriesRef.get();
//   if (liveriesSnapshot.empty) return liveries;

//   liveriesSnapshot.forEach((livery) =>
//     liveries.push(livery.data() as LiveryDataType)
//   );

//   return liveries;
// };

// export const getLiveryById = async (id: string) => {
//   const liveryRef = firestore.collection(Collection.LIVERIES).doc(id);

//   const liveryDoc = await liveryRef.get();

//   if (!liveryDoc.exists) return undefined;

//   return liveryDoc.data() as LiveryDataType;
// };
