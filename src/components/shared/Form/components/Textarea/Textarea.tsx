import React from 'react';
import {
  ComponentWithAs,
  Textarea as ChakraTextarea,
  TextareaProps as ChakraTextareaProps,
  chakra
} from '@chakra-ui/react';
import { useForm } from '../../Form';
import { defaultOnChange, FOCUS_BORDER_COLOR } from '../../utils';
import { DefaultInputProps } from '../../types';

type TextareaProps = DefaultInputProps;
/**
 * Accepts any props accepted by ChakraUI Textarea and a label: ReactNode and stateKey: string. State is handled internally, but can be overridden by supplying onChange and value props.
 * @returns Function Component
 */
const TextArea: ComponentWithAs<
  'textarea',
  ChakraTextareaProps & TextareaProps
> = ({ label, stateKey, ...chakraProps }) => {
  const { state, setState } = useForm();
  const onChange = defaultOnChange<HTMLTextAreaElement>(setState, stateKey);
  return (
    <>
      {label && (
        <chakra.label
          htmlFor={`${stateKey}-textarea`}
          px={1}
          pb={0.5}
          fontSize="sm"
        >
          {label}
        </chakra.label>
      )}
      <ChakraTextarea
        test-id={`${stateKey}-textarea`}
        id={`${stateKey}-textarea`}
        type="text"
        onChange={onChange}
        value={state[stateKey] || ''}
        focusBorderColor={FOCUS_BORDER_COLOR}
        {...chakraProps}
      />
    </>
  );
};

export default TextArea;
