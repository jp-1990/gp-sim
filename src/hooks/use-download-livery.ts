import { thunks } from '../store/livery/slice';
import { useAppDispatch } from '../store/store';
import { RequestStatus } from '../types';

export const useDownloadLivery = () => {
  const dispatch = useAppDispatch();

  const onDownload =
    ({
      targetLiveryId,
      selectedLiveries
    }: {
      targetLiveryId: string;
      selectedLiveries: string[];
    }) =>
    async () => {
      const liveriesToDownload = [
        ...new Set([...selectedLiveries, targetLiveryId])
      ];

      const liveryURLPromises = liveriesToDownload.map((id) =>
        dispatch(thunks.getLiveryDownloadUrl({ id }))
      );
      const settledPromises = await Promise.allSettled(liveryURLPromises);

      const liveryFileURLs: string[] = [];
      for (const promise of settledPromises) {
        if (promise.status === RequestStatus.FULFILLED)
          liveryFileURLs.push(promise.value.payload as string);
      }

      for (let i = 0, j = liveryFileURLs.length; i < j; i++) {
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = liveryFileURLs[i];
          }
        }, 200 + i * 200);
      }
    };

  return {
    onDownload
  };
};
