import data from '../../utils/dev-data/liveries.json';

export const getLiveries = async () => {
  return data as any;
};

export const getLiveryById = async (id: string) => {
  const livery = data.find((livery) => livery.id === id);
  if (!livery) return undefined;

  return { ...livery, deleted: false };
};
