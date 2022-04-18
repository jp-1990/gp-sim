import { FormattedMessage } from 'react-intl';
import { formStrings } from '../../../../utils/intl';

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
