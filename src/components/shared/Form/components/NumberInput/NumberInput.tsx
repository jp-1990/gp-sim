/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
  ComponentWithAs,
  NumberInput as ChakraNumberInput,
  NumberInputProps as ChakraNumberInputProps,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper
} from '@chakra-ui/react';

import { useForm } from '../../Form';
import ControlWrapper from '../ControlWrapper/ControlWrapper';
import {
  numberInputOnChange,
  isFieldValid,
  FOCUS_BORDER_COLOR,
  addToInvalidFields,
  removeFromInvalidFields
} from '../../utils';
import { DefaultInputProps } from '../../types';

type NumberInputProps = DefaultInputProps;
/**
 * Accepts any props accepted by ChakraUI Input and a label: ReactNode, stateKey: string and array of validators. State is handled internally, but can be overridden by supplying onChange and value props.
 * @returns Function Component
 */
const NumberInput: ComponentWithAs<
  'div',
  ChakraNumberInputProps & NumberInputProps
> = ({ label, stateKey, validators, ...chakraProps }) => {
  const { state, setState } = useForm();
  const fieldId = `${stateKey}-number-input`;

  const onChange = numberInputOnChange(setState, stateKey);
  const isValid = isFieldValid(state[stateKey], validators);

  useEffect(() => {
    if (!isValid.valid) addToInvalidFields(stateKey, setState);
    if (isValid.valid) removeFromInvalidFields(stateKey, setState);
  }, [isValid.valid]);

  return (
    <ControlWrapper
      htmlFor={fieldId}
      label={label}
      isRequired={chakraProps.isRequired}
      isValid={isValid.valid}
      errorText={isValid.message}
    >
      <ChakraNumberInput
        test-id={fieldId}
        id={fieldId}
        onChange={onChange}
        value={state[stateKey] || ''}
        aria-labelledby={'field-1-label'}
        focusBorderColor={FOCUS_BORDER_COLOR}
        {...chakraProps}
      />
    </ControlWrapper>
  );
};

export default NumberInput;
export {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper
};
