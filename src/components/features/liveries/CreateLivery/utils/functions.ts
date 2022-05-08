import { UserProfile } from '@auth0/nextjs-auth0';
import JSZip from 'jszip';

import { FormStateType } from '../../../../shared/Form/types';
import { LIVERY_FILE_NAMES } from '../../../../shared/Form/utils';
import { CreateLiveryFormStateType } from '../types';
import { CreateLiveryDataType } from '../../../../../types';

interface MapCreateLiveryFormStateToActionInputArgs {
  formState: FormStateType<CreateLiveryFormStateType>;
  user: UserProfile | undefined;
}
export const mapCreateLiveryFormStateToActionInput = ({
  formState,
  user
}: MapCreateLiveryFormStateToActionInputArgs): Omit<
  CreateLiveryDataType,
  'liveryZip' | 'imageFiles'
> => {
  if (!user?.sub) throw new Error('No user found');
  return {
    title: formState.title,
    car: formState.car,
    description: formState.description,
    price: typeof formState.price === 'string' ? 0 : formState.price,
    creator: {
      id: user.sub,
      displayName: user.nickname || '',
      image: user.picture
    },
    tags: formState.searchTags,
    isPublic: formState.publicLivery,
    garage: formState.privateGarage ? formState.garage : undefined,
    garageKey: formState.privateGarage ? formState.garageKey : undefined
  };
};

interface ZipLiveryFilesArgs {
  folderName: string;
  liveryFiles: File[];
}
export const zipLiveryFiles = async ({
  folderName,
  liveryFiles
}: ZipLiveryFilesArgs) => {
  const zip = new JSZip();
  const carFolder = zip.folder('Car');
  const liveryFolder = zip.folder('Liveries')?.folder(folderName);
  const carFolderFiles = liveryFiles.filter(
    (el) =>
      !LIVERY_FILE_NAMES.includes(el.name as typeof LIVERY_FILE_NAMES[number])
  );
  const liveryFolderFiles = liveryFiles.filter((el) =>
    LIVERY_FILE_NAMES.includes(el.name as typeof LIVERY_FILE_NAMES[number])
  );
  carFolder?.file(carFolderFiles[0].name, carFolderFiles[0]);
  liveryFolderFiles.forEach((file) => liveryFolder?.file(file.name, file));

  const liveryZip = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  return liveryZip;
};
