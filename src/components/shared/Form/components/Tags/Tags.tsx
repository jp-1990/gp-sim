/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, useEffect } from 'react';
import {
  Input as ChakraInput,
  InputProps as ChakraInputProps
} from '@chakra-ui/react';
import { FormattedMessage } from 'react-intl';

import { useForm } from '../../Form';
import ControlWrapper from '../ControlWrapper/ControlWrapper';
import {
  addToInvalidFields,
  FOCUS_BORDER_COLOR,
  isFieldValid,
  removeFromInvalidFields,
  tagsOnChange
} from '../../utils';
import {
  DefaultInputProps,
  isStateWithStateKey,
  StateWithStateKey
} from '../../types';
import { commonStrings, formStrings } from '../../../../../utils/intl';

type TagsProps<T extends string> = DefaultInputProps &
  ChakraInputProps & {
    helperText?: React.ReactNode;
    children?:
      | ((state: StateWithStateKey<T, string> | undefined) => React.ReactNode)
      | ReactNode;
  };

/**
 * Accepts any props accepted by ChakraUI Input and a label: ReactNode, stateKey: string, validators: string[ ], and helperText: ReactNode. State is handled internally, but can be overridden by supplying onChange and value props. State is also available as the first argument of a function provided as children.
 * @returns Function Component
 */
const Tags = <T extends string>({
  label = <FormattedMessage {...commonStrings.selectImages} />,
  helperText = <FormattedMessage {...formStrings.searchTagsHelperText} />,
  stateKey,
  validators,
  children,
  ...chakraProps
}: TagsProps<T>) => {
  const { state, setState } = useForm();
  const fieldId = `${stateKey}-tags`;

  useEffect(() => {
    setState((prev) => {
      const prevState = { ...prev };
      prevState[stateKey] = '';
      return prevState;
    });
  }, []);

  const onChange = tagsOnChange(setState, stateKey);
  const isValid = isFieldValid(state[stateKey], validators);

  useEffect(() => {
    if (!isValid.valid) addToInvalidFields(stateKey, setState);
    if (isValid.valid) removeFromInvalidFields(stateKey, setState);
  }, [isValid.valid]);

  const childrenStateInput = isStateWithStateKey<T, string>(state, stateKey)
    ? state
    : undefined;

  return (
    <ControlWrapper
      htmlFor={fieldId}
      isValid={isValid.valid}
      label={label}
      helperText={helperText}
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
      {children && typeof children === 'function'
        ? children(childrenStateInput)
        : children}
    </ControlWrapper>
  );
};

export default Tags;
