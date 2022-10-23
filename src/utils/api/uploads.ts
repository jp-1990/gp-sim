import { Part } from 'formidable';
import IncomingForm from 'formidable/Formidable';
import { PassThrough } from 'stream';

export type UploadFile = {
  stream?: PassThrough;
  filename?: string;
  mimetype?: string | null;
  formField?: string | null;
};
export type UploadFiles = {
  [key: string]: UploadFile;
};
/**
 * A curried overwrite for formidable onPart. Will handle 'fields' using formidable's default behaviour, but provides a custom implementation for handling files. This will write the filename and data stream to the input files object to allow external access.
 *
 * @param files - Object containing upload files ({@link UploadFile})
 * @param form - formidable IncomingForm instance
 * @param formFields - { name, limit }[ ] of the form fields which should contain the files
 *
 * @returns A function accepting (part) to overwrite the default formidable onPart function
 */
export const customOnFormidablePart =
  (
    files: UploadFiles,
    form: IncomingForm,
    formFields: { name: string; limit: number }[]
  ) =>
  (part: Part) => {
    // let formidable handle all non-file parts
    if (!part.originalFilename) {
      form._handlePart(part);
      return;
    }

    // do not overwrite existing file or process an invalid form field
    const invalidDataKey = !formFields.find((el) => el.name === part.name);
    const fileExists = Object.prototype.hasOwnProperty.call(
      files,
      part.originalFilename
    );
    if (invalidDataKey || fileExists || !part.name) return;

    const uploadFiles = Object.values(files).reduce((prev, cur) => {
      if (!cur.formField) return prev;
      prev[cur.formField] ?? (prev[cur.formField] = 0);
      prev[cur.formField]++;
      return prev;
    }, {} as Record<string, any>);

    uploadFiles[part.name] ?? (uploadFiles[part.name] = 0);
    uploadFiles[part.name]++;

    let overLimit = false;
    for (const { name, limit } of formFields) {
      if (uploadFiles[name] > limit) overLimit = true;
    }

    // do not process more than the set number of files
    if (overLimit) return;

    const passThrough = new PassThrough();
    files[part.originalFilename] = {};
    files[part.originalFilename].stream = passThrough;
    files[part.originalFilename].filename = part.originalFilename;
    files[part.originalFilename].mimetype = part.mimetype;
    files[part.originalFilename].formField = part.name;
    part.pipe(passThrough);
  };

/**
 * Validates the input object against the array of expected keys. Will return false if there are any extra properties, or if partial is set to 'exact', and an object property is missing
 *
 * @param data - any object
 * @param expectedKeys - string array of keys expected to exist on the data object
 * @param partial - if 'partial', object properties can be absent
 * @returns boolean
 */
export const validateObject = (
  data: Record<string, any>,
  expectedKeys: string[],
  partial: 'partial' | 'exact' = 'partial'
): boolean => {
  switch (partial) {
    case 'exact': {
      // check all expected properties exist
      for (const key of expectedKeys) {
        if (!Object.prototype.hasOwnProperty.call(data, key)) return false;
      }
      // check there are no extra properties
      const dataKeys = Object.keys(data);
      for (const key of dataKeys) {
        if (!expectedKeys.includes(key)) return false;
      }
      return true;
    }
    case 'partial': {
      // check there are no extra properties
      const dataKeys = Object.keys(data);
      for (const key of dataKeys) {
        if (!expectedKeys.includes(key)) return false;
      }
      return true;
    }
  }
};
