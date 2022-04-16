import React from 'react';
import {
  ComponentWithAs,
  NumberInput as ChakraNumberInput,
  NumberInputProps as ChakraNumberInputProps,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  chakra
} from '@chakra-ui/react';
import { useForm } from '../../Form';
import { FOCUS_BORDER_COLOR, numberInputOnChange } from '../../utils';
import { DefaultInputProps } from '../../types';

type NumberInputProps = DefaultInputProps;
/**
 * Accepts any props accepted by ChakraUI Input and a label: ReactNode and stateKey: string. State is handled internally, but can be overridden by supplying onChange and value props.
 * @returns Function Component
 */
const NumberInput: ComponentWithAs<
  'div',
  ChakraNumberInputProps & NumberInputProps
> = ({ label, stateKey, ...chakraProps }) => {
  const { state, setState } = useForm();
  const onChange = numberInputOnChange(setState, stateKey);
  return (
    <>
      {label && (
        <chakra.label
          id={`${stateKey}-number-input-label`}
          px={1}
          pb={0.5}
          fontSize="sm"
        >
          {label}
        </chakra.label>
      )}
      <ChakraNumberInput
        test-id={`${stateKey}-number-input`}
        id={`${stateKey}-number-input`}
        onChange={onChange}
        value={state[stateKey] || ''}
        aria-labelledby={`${stateKey}-number-input-label`}
        focusBorderColor={FOCUS_BORDER_COLOR}
        {...chakraProps}
      />
    </>
  );
};

export default NumberInput;
export {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper
};
