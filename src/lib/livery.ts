import { LiveriesDataType, LiveryDataType } from '../types';
import { Collection, firestore } from '../utils/firebase/admin';
import data from '../utils/dev-data/liveries.json';

const getLiveries = async () => {
  if (process.env.NEXT_PUBLIC_ENABLE_MSW === 'true') {
    return data as LiveriesDataType;
  }

  const liveriesRef = firestore.collection(Collection.LIVERIES);

  const liveries = [] as LiveriesDataType;

  const liveriesSnapshot = await liveriesRef.get();
  if (liveriesSnapshot.empty) return liveries;

  liveriesSnapshot.forEach((livery) =>
    liveries.push(livery.data() as LiveryDataType)
  );

  return liveries;
};

const getLiveryById = async (id: string) => {
  if (process.env.NEXT_PUBLIC_ENABLE_MSW === 'true') {
    const livery = data.find((livery) => livery.id === id);
    if (!livery) return undefined;

    return { ...livery, deleted: false };
  }

  const liveryRef = firestore.collection(Collection.LIVERIES).doc(id);

  const liveryDoc = await liveryRef.get();

  if (!liveryDoc.exists) return undefined;

  return liveryDoc.data() as LiveryDataType;
};

const functions = { getLiveries, getLiveryById };
export default functions;
