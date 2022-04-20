import store from '../../store/store';
import { CreateLiveryDataType } from '../../types';

export type PostLiveryArgs = CreateLiveryDataType;
export const postLivery = async (newLivery: PostLiveryArgs) => {
  return new Promise<CreateLiveryDataType>((resolve) => {
    const nextId = store.getState().livery.ids.length;
    setTimeout(
      () =>
        resolve({
          ...newLivery,
          id: `${nextId}`
        }),
      500
    );
  });
};
