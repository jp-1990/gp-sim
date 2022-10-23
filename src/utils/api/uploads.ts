import { Part } from 'formidable';
import IncomingForm from 'formidable/Formidable';
import { PassThrough } from 'stream';

export type UploadFile = {
  stream?: PassThrough;
  filename?: string;
};
export type UploadFiles = {
  [key: string]: UploadFile;
};
/**
 * A curried overwrite for formidable onPart. Will handle 'fields' using formidable's default behaviour, but provides a custom implementation for handling files. This will write the filename and data stream to the input files object so allow external access.
 *
 * @param files - Object containing upload files ({@link UploadFile})
 * @param form - formidable IncomingForm instance
 * @param limit - number (default = 1). The number of files to allow
 *
 * @returns A function accepting (part) to overwrite the default formidable onPart function
 */
export const customOnFormidablePart =
  (files: UploadFiles, form: IncomingForm, dataKey: string, limit = 1) =>
  (part: Part) => {
    // let formidable handle all non-file parts
    if (!part.originalFilename) {
      form._handlePart(part);
      return;
    }

    // do not overwrite existing file, upload more files than limit or when invalid datakey
    if (
      Object.keys(files).length >= limit ||
      files[part.originalFilename]?.stream ||
      part.name !== dataKey
    )
      return;

    const passThrough = new PassThrough();
    files[part.originalFilename] = {};
    files[part.originalFilename].stream = passThrough;
    files[part.originalFilename].filename = part.originalFilename;
    part.pipe(passThrough);
  };
