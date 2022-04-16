import React from 'react';
import {
  ComponentWithAs,
  Textarea as ChakraTextarea,
  TextareaProps as ChakraTextareaProps
} from '@chakra-ui/react';

import { useForm } from '../../Form';
import ControlWrapper from '../ControlWrapper/ControlWrapper';
import { defaultOnChange, FOCUS_BORDER_COLOR, isFieldValid } from '../../utils';
import { DefaultInputProps } from '../../types';

type TextareaProps = DefaultInputProps;
/**
 * Accepts any props accepted by ChakraUI Textarea and a label: ReactNode and stateKey: string. State is handled internally, but can be overridden by supplying onChange and value props.
 * @returns Function Component
 */
const TextArea: ComponentWithAs<
  'textarea',
  ChakraTextareaProps & TextareaProps
> = ({ label, stateKey, validators, ...chakraProps }) => {
  const { state, setState } = useForm();
  const fieldId = `${stateKey}-textarea`;

  const onChange = defaultOnChange<HTMLTextAreaElement>(setState, stateKey);
  const isValid = isFieldValid(state[stateKey], validators);

  return (
    <ControlWrapper
      htmlFor={fieldId}
      label={label}
      isRequired={chakraProps.isRequired}
      isValid={isValid.valid}
      errorText={isValid.message}
    >
      <ChakraTextarea
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

export default TextArea;
