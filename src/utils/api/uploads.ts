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
  (files: UploadFiles, form: IncomingForm, limit = 1) =>
  (part: Part) => {
    // let formidable handle all non-file parts
    if (!part.originalFilename) {
      form._handlePart(part);
      return;
    }
    // do not overwrite existing file or upload more files than limit
    if (Object.keys(files).length === limit) return;
    if (files[part.originalFilename]?.stream) return;

    const passThrough = new PassThrough();
    files[part.originalFilename] = {};
    files[part.originalFilename].stream = passThrough;
    files[part.originalFilename].filename = part.originalFilename;
    part.pipe(passThrough);
  };
