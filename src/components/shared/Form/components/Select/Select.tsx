import React from 'react';
import {
  ComponentWithAs,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
  chakra
} from '@chakra-ui/react';
import { useForm } from '../../Form';
import { defaultOnChange, FOCUS_BORDER_COLOR, isFieldValid } from '../../utils';
import { DefaultInputProps } from '../../types';
import ControlWrapper from '../ControlWrapper/ControlWrapper';

type SelectProps = DefaultInputProps;
/**
 * Accepts any props accepted by ChakraUI Select and a label: ReactNode, stateKey: string and array of validators. State is handled internally, but can be overridden by supplying onChange and value props.
 * @returns Function Component
 */
const Select: ComponentWithAs<'select', ChakraSelectProps & SelectProps> = ({
  label,
  stateKey,
  validators,
  children,
  ...chakraProps
}) => {
  const { state, setState } = useForm();
  const fieldId = `${stateKey}-select`;

  const onChange = defaultOnChange<HTMLSelectElement>(setState, stateKey);
  const isValid = isFieldValid(state[stateKey], validators);

  return (
    <ControlWrapper
      htmlFor={fieldId}
      label={label}
      isRequired={chakraProps.isRequired}
      isValid={isValid.valid}
      errorText={isValid.message}
    >
      <ChakraSelect
        test-id={fieldId}
        id={fieldId}
        onChange={onChange}
        value={state[stateKey]}
        focusBorderColor={FOCUS_BORDER_COLOR}
        {...chakraProps}
      >
        {children}
      </ChakraSelect>
    </ControlWrapper>
  );
};

export default Select;
