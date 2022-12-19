import data from '../../utils/dev-data/users.json';

export const getUsers = async () => {
  return data;
};

export const getUserById = async (id: string) => {
  return data.find((user) => user.id === id);
};
