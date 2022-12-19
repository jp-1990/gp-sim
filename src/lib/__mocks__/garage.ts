import data from '../../utils/dev-data/garages.json';

export const getGarages = async () => {
  return data as any;
};

export const getGarageById = async (id: string) => {
  return data.find((garage) => garage.id === id);
};
