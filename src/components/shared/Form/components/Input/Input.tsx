import React from 'react';
import {
  ComponentWithAs,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  chakra
} from '@chakra-ui/react';
import { useForm } from '../../Form';
import { defaultOnChange, FOCUS_BORDER_COLOR } from '../../utils';
import { DefaultInputProps } from '../../types';

type InputProps = DefaultInputProps;
/**
 * Accepts any props accepted by ChakraUI Input and a label: ReactNode and stateKey: string. State is handled internally, but can be overridden by supplying onChange and value props.
 * @returns Function Component
 */
const Input: ComponentWithAs<'input', ChakraInputProps & InputProps> = ({
  label,
  stateKey,
  ...chakraProps
}) => {
  const { state, setState } = useForm();
  const onChange = defaultOnChange<HTMLInputElement>(setState, stateKey);
  return (
    <>
      {label && (
        <chakra.label
          htmlFor={`${stateKey}-input`}
          px={1}
          pb={0.5}
          fontSize="sm"
        >
          {label}
        </chakra.label>
      )}
      <ChakraInput
        test-id={`${stateKey}-input`}
        id={`${stateKey}-input`}
        type="text"
        onChange={onChange}
        value={state[stateKey] || ''}
        focusBorderColor={FOCUS_BORDER_COLOR}
        {...chakraProps}
      />
    </>
  );
};

export default Input;
