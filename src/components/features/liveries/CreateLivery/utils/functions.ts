import JSZip from 'jszip';

import { FormStateType } from '../../../../shared/Form/types';
import { LIVERY_FILE_NAMES } from '../../../../shared/Form/utils';
import { CreateLiveryFormStateType } from '../types';
import { CreateLiveryDataType } from '../../../../../types';

interface MapCreateLiveryFormStateToRequestInputArgs {
  formState: FormStateType<CreateLiveryFormStateType>;
  user: any | undefined;
}
export const mapCreateLiveryFormStateToRequestInput = ({
  formState,
  user
}: MapCreateLiveryFormStateToRequestInputArgs): Omit<
  CreateLiveryDataType,
  'liveryZip' | 'imageFiles'
> => {
  if (process.env.NODE_ENV === 'development') {
    user = {
      sub: `${new Date(Date.now()).valueOf()}`,
      displayName: 'dev-testing',
      image: ''
    };
  }
  if (!user?.sub) throw new Error('No user found');
  return {
    title: formState.title,
    car: formState.car,
    description: formState.description ?? '',
    price: typeof formState.price === 'string' ? 0 : formState.price ?? 0,
    tags: formState.searchTags ?? '',
    isPublic: formState.publicLivery,
    garage: formState.privateGarage ? formState.garage ?? '' : '',
    garageKey: formState.privateGarage ? formState.garageKey ?? '' : ''
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
