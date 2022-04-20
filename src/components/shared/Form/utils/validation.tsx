import { FormattedMessage } from 'react-intl';
import { formStrings } from '../../../../utils/intl';

export const DYNAMIC_LIVERY_FILE_NAME = '[your-livery-name].json';
export const LIVERY_FILE_NAMES = [
  'sponsors.json',
  'sponsors.png',
  'decals.json',
  'decals.png'
] as const;

/**
 * Used to find the 5th file required for livery upload, which does not have a fixed name, in a list of Files.
 * @param files - Array of Files
 * @returns File | undefined
 */
export const findDynamicLiveryFile = (files: File[]) =>
  files.find((f) => {
    const name = f.name as typeof LIVERY_FILE_NAMES[number];
    return !LIVERY_FILE_NAMES.includes(name);
  });

/**
 * Validates that the provided string only contains - _ space and number and letters. Must also end with .json.
 * @param string - String to validate
 * @returns RegExpMatchArray | null
 */
export const validatedDynamicLiveryFilename = (string: string) =>
  string.match(/^[a-zA-Z0-9]+([-_\s]{1}[a-zA-Z0-9]+)(\.json)/g);

export type ValidationOptionsType = keyof typeof validatorFunctions;
export type IsFieldValidReturnType = {
  valid: boolean;
  message: React.ReactNode | undefined;
  priority: number;
};

const validatorFunctions = {
  /**
   * value must be string and longer than 0
   */
  NON_NULL_STRING: (value: any) => {
    if (typeof value === 'string' && value.length > 0) return true;
    return {
      message: <FormattedMessage {...formStrings.fieldNull} />,
      priority: 0
    };
  },
  /**
   * All 4 fixed file name required files must be present, and one other .json file
   */
  NON_NULL_LIVERY_FILES: (value: any) => {
    // value will be initialised as empty array after first render, undefined should not trigger validation
    if (value === undefined) return true;

    const missingFiles = LIVERY_FILE_NAMES.reduce((prev, filename) => {
      const output = [...prev];
      if (!value.find((file: any) => file.name === filename))
        output.push(filename);
      return output;
    }, [] as string[]);

    if (!findDynamicLiveryFile(value))
      missingFiles.unshift(DYNAMIC_LIVERY_FILE_NAME);

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
  /**
   * dynamic named .json file must exist, and be alpha-numeric with - _ and space as the only other characters
   */
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

/**
 * Runs the validator function for the provided validator against the provided value.
 * @param value - any
 * @param validator - Key of validatorFunctions
 * @returns true if valid | object with an error message, and a number indicating the priority of the error. Lower is higher priority
 */
const validate = (value: any, validator: ValidationOptionsType) => {
  return validatorFunctions[validator](value);
};

/**
 *
 * @param value - any
 * @param validators - array of validators (key of validatorFunctions)
 * @returns Object { valid: boolean, message: string, priority: number }. This output, where valid === false, will contain the message and priority of the highest priority failed validator.
 */
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
