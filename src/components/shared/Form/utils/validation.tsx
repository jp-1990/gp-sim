import { FormattedMessage } from 'react-intl';
import { formStrings } from '../../../../utils/intl';

// liveryname.json
// /^[a-zA-Z0-9]+([-_\s]{1}[a-zA-Z0-9]+)(\.json)/g

export const liveryFilenames = [
  'sponsors.json',
  'sponsors.png',
  'decals.json',
  'decals.png'
] as const;

export const findDynamicLiveryFile = (files: File[]) =>
  files.find((f) => {
    const name = f.name as typeof liveryFilenames[number];
    return !liveryFilenames.includes(name);
  });
export const validatedDynamicLiveryFilename = (string: string) =>
  string.match(/^[a-zA-Z0-9]+([-_\s]{1}[a-zA-Z0-9]+)(\.json)/g);

export type ValidationOptionsType = keyof typeof validatorFunctions;
export type IsFieldValidReturnType = {
  valid: boolean;
  message: React.ReactNode | undefined;
  priority: number;
};

const validatorFunctions = {
  NON_NULL_STRING: (value: any) => {
    if (typeof value === 'string' && value.length > 0) return true;
    return {
      message: <FormattedMessage {...formStrings.fieldNull} />,
      priority: 0
    };
  },
  NON_NULL_LIVERY_FILES: (value: any) => {
    // value will be initialised as empty array after first render, undefined should not trigger validation
    if (value === undefined) return true;

    const missingFiles = liveryFilenames.reduce((prev, filename) => {
      const output = [...prev];
      if (!value.find((file: any) => file.name === filename))
        output.push(filename);
      return output;
    }, [] as string[]);

    if (!findDynamicLiveryFile(value))
      missingFiles.unshift('[your-livery-name].json');

    if (!missingFiles.length) return true;
    return {
      message: (
        <FormattedMessage
          {...formStrings.invalidLiveryFiles}
          values={{ files: missingFiles.join(', ') }}
        />
      ),
      priority: 0
    };
  },
  DYNAMIC_LIVERY_FILE_NAME: (value: any) => {
    // value will be initialised as empty array after first render, undefined should not trigger validation
    if (value === undefined) return true;

    const dynamicLiveryFilename = findDynamicLiveryFile(value)?.name || '';
    const isValid = !!validatedDynamicLiveryFilename(dynamicLiveryFilename);

    if (isValid) return true;
    return {
      message: <FormattedMessage {...formStrings.dynamicLiveryFileName} />,
      priority: 1
    };
  }
};
export const validatorOptions = Object.fromEntries(
  Object.keys(validatorFunctions).map((key) => [key, key])
) as Record<ValidationOptionsType, ValidationOptionsType>;

const validate = (value: any, validator: ValidationOptionsType) => {
  return validatorFunctions[validator](value);
};

export const isFieldValid = (
  value: any,
  validators: ValidationOptionsType[] | undefined
) => {
  if (!validators)
    return {
      valid: true,
      message: undefined,
      priority: Infinity
    };
  return validators.reduce(
    (_prev, cur) => {
      const prev = { ..._prev };
      const isValid = validate(value, cur);
      if (isValid === true) return prev;
      if (isValid.priority > prev.priority) return prev;
      return { valid: false, ...isValid };
    },
    {
      valid: true,
      message: undefined,
      priority: Infinity
    } as IsFieldValidReturnType
  );
};
export type IsFieldValidType = typeof isFieldValid;
