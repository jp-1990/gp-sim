/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
  ComponentWithAs,
  Checkbox as ChakraCheckbox,
  CheckboxProps as ChakraCheckboxProps
} from '@chakra-ui/react';

import { useForm } from '../../Form';
import ControlWrapper from '../ControlWrapper/ControlWrapper';
import {
  checkboxOnChange,
  isFieldValid,
  FOCUS_BORDER_COLOR,
  addToInvalidFields,
  removeFromInvalidFields
} from '../../utils';
import { DefaultInputProps } from '../../types';

type CheckboxProps = Omit<DefaultInputProps, 'label'>;
/**
 * Accepts any props accepted by ChakraUI Checkbox, stateKey: string and array of validators. State is handled internally, but can be overridden by supplying onChange and value props.
 * @returns Function Component
 */
const Checkbox: ComponentWithAs<
  'input',
  ChakraCheckboxProps & CheckboxProps
> = ({ stateKey, validators, children, ...chakraProps }) => {
  const { state, setState } = useForm();
  const fieldId = `${stateKey}-checkbox`;

  const onChange = checkboxOnChange<HTMLInputElement>(setState, stateKey);
  const isValid = isFieldValid(state[stateKey], validators);

  useEffect(() => {
    if (!isValid.valid) addToInvalidFields(stateKey, setState);
    if (isValid.valid) removeFromInvalidFields(stateKey, setState);
  }, [isValid.valid]);

  return (
    <ControlWrapper
      htmlFor={fieldId}
      isRequired={chakraProps.isRequired}
      isValid={isValid.valid}
      errorText={isValid.message}
    >
      <ChakraCheckbox
        test-id={fieldId}
        id={fieldId}
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
    </ControlWrapper>
  );
};

export default Checkbox;
