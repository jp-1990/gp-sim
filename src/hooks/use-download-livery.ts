import { LiverySliceStateType } from '../store/livery/api-slice';

export const useDownloadLivery = () => {
  const onDownload =
    ({
      targetLiveryId,
      selectedLiveries,
      currentUser,
      liveries
    }: {
      targetLiveryId: string;
      selectedLiveries: string[];
      currentUser: any;
      liveries: LiverySliceStateType | undefined;
    }) =>
    () => {
      const liveriesToDownload = [
        ...new Set([...selectedLiveries, targetLiveryId])
      ];
      const liveryFileURLs = liveriesToDownload.reduce((prev, id) => {
        if (!currentUser.liveries.includes(`${id}`)) return prev;
        const output = [...prev];
        const URL = liveries?.entities[id]?.liveryFiles;
        if (URL) output.push(URL);
        return output;
      }, [] as string[]);

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
