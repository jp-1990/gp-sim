import React from 'react';
import {
  ComponentWithAs,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
  chakra
} from '@chakra-ui/react';
import { useForm } from '../../Form';
import { defaultOnChange, FOCUS_BORDER_COLOR } from '../../utils';
import { DefaultInputProps } from '../../types';

type SelectProps = DefaultInputProps;
/**
 * Accepts any props accepted by ChakraUI Select and a label: ReactNode and stateKey: string. State is handled internally, but can be overridden by supplying onChange and value props.
 * @returns Function Component
 */
const Select: ComponentWithAs<'select', ChakraSelectProps & SelectProps> = ({
  label,
  stateKey,
  children,
  ...chakraProps
}) => {
  const { state, setState } = useForm();
  const onChange = defaultOnChange<HTMLSelectElement>(setState, stateKey);

  return (
    <>
      {label && (
        <chakra.label
          htmlFor={`${stateKey}-select`}
          px={1}
          pb={0.5}
          fontSize="sm"
        >
          {label}
        </chakra.label>
      )}
      <ChakraSelect
        test-id={`${stateKey}-select`}
        id={`${stateKey}-select`}
        onChange={onChange}
        value={state[stateKey]}
        focusBorderColor={FOCUS_BORDER_COLOR}
        {...chakraProps}
      >
        {children}
      </ChakraSelect>
    </>
  );
};

export default Select;
