import React from 'react';
import {
  ComponentWithAs,
  Checkbox as ChakraCheckbox,
  CheckboxProps as ChakraCheckboxProps
} from '@chakra-ui/react';
import { useForm } from '../../Form';
import { checkboxOnChange, FOCUS_BORDER_COLOR } from '../../utils';
import { DefaultInputProps } from '../../types';

type CheckboxProps = Omit<DefaultInputProps, 'label'>;
/**
 * Accepts any props accepted by ChakraUI Checkbox and a stateKey: string. State is handled internally, but can be overridden by supplying onChange and value props.
 * @returns Function Component
 */
const Checkbox: ComponentWithAs<
  'input',
  ChakraCheckboxProps & CheckboxProps
> = ({ stateKey, children, ...chakraProps }) => {
  const { state, setState } = useForm();
  const onChange = checkboxOnChange<HTMLInputElement>(setState, stateKey);

  return (
    <ChakraCheckbox
      test-id={`${stateKey}-checkbox`}
      id={`${stateKey}-checkbox`}
      onChange={onChange}
      value={state[stateKey]}
      focusBorderColor={FOCUS_BORDER_COLOR}
      css={`
        > span:first-of-type {
          box-shadow: unset;
        }
      `}
      {...chakraProps}
    >
      {children}
    </ChakraCheckbox>
  );
};

export default Checkbox;
