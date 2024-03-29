/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
  ComponentWithAs,
  Input as ChakraInput,
  InputProps as ChakraInputProps
} from '@chakra-ui/react';

import { useForm } from '../../Form';
import ControlWrapper from '../ControlWrapper/ControlWrapper';
import {
  defaultOnChange,
  isFieldValid,
  FOCUS_BORDER_COLOR,
  addToInvalidFields,
  removeFromInvalidFields
} from '../../utils';
import { DefaultInputProps } from '../../types';

type InputProps = DefaultInputProps;
/**
 * Accepts any props accepted by ChakraUI Input and a label: ReactNode, stateKey: string and array of validators. State is handled internally, but can be overridden by supplying onChange and value props.
 * @returns Function Component
 */
const Input: ComponentWithAs<'input', ChakraInputProps & InputProps> = ({
  label,
  stateKey,
  validators,
  ...chakraProps
}) => {
  const { state, setState } = useForm();
  const fieldId = `${stateKey}-input`;

  const onChange = defaultOnChange<HTMLInputElement>(setState, stateKey);
  const isValid = isFieldValid(state[stateKey], validators);

  useEffect(() => {
    if (!isValid.valid) addToInvalidFields(stateKey, setState);
    if (isValid.valid) removeFromInvalidFields(stateKey, setState);
  }, [isValid.valid]);

  return (
    <ControlWrapper
      htmlFor={fieldId}
      label={label}
      ariaLabel={chakraProps['aria-label' as keyof typeof chakraProps]}
      isRequired={chakraProps.isRequired}
      isValid={isValid.valid}
      errorText={isValid.message}
    >
      <ChakraInput
        test-id={fieldId}
        id={fieldId}
        type="text"
        onChange={onChange}
        value={state[stateKey] || ''}
        focusBorderColor={FOCUS_BORDER_COLOR}
        {...chakraProps}
      />
    </ControlWrapper>
  );
};

export default Input;
