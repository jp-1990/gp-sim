/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Flex, FormHelperText } from '@chakra-ui/react';
import React, { ReactNode, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { useForm } from '../../Form';
import ControlWrapper from '../ControlWrapper/ControlWrapper';
import {
  addToInvalidFields,
  isFieldValid,
  removeFromInvalidFields,
  selectFilesOnChange,
  selectFilesRemoveByIndex,
  setInputTargetValueToEmptyString
} from '../../utils';
import {
  DefaultInputProps,
  isStateWithStateKey,
  StateWithStateKey
} from '../../types';
import { commonStrings } from '../../../../../utils/intl';

interface SelectFilesProps<T extends string> extends DefaultInputProps {
  accept?: string;
  'aria-label'?: string;
  helperText?: React.ReactNode;
  max?: number;
  children?:
    | ((
        state: StateWithStateKey<T, File[]> | undefined,
        removeImageByIndex: (index: number) => void
      ) => React.ReactNode)
    | ReactNode;
}

const SelectFiles = <T extends string>({
  accept,
  helperText,
  label = <FormattedMessage {...commonStrings.selectFiles} />,
  ['aria-label']: ariaLabel,
  max,
  stateKey,
  validators,
  children
}: SelectFilesProps<T>) => {
  const { state, setState } = useForm();
  const fieldId = `${stateKey}-selectFiles`;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Next cannot read type of 'prev' on build
    setState((prev) => {
      const prevState = { ...prev };
      prevState[stateKey] = [] as File[];
      return prevState;
    });
  }, []);

  const onChange = selectFilesOnChange(setState, stateKey, max);
  const onRemove = selectFilesRemoveByIndex(setState, stateKey, max);
  const isValid = isFieldValid(state[stateKey], validators);

  useEffect(() => {
    if (!isValid.valid) addToInvalidFields(stateKey, setState);
    if (isValid.valid) removeFromInvalidFields(stateKey, setState);
  }, [isValid.valid]);

  const childrenStateInput = isStateWithStateKey<T, File[]>(state, stateKey)
    ? state
    : undefined;

  return (
    <ControlWrapper
      htmlFor={fieldId}
      ariaLabel={ariaLabel}
      isValid={isValid.valid}
      errorText={isValid.message}
    >
      <Flex>
        <Button
          as="label"
          size={'sm'}
          px={12}
          lineHeight={1}
          htmlFor={fieldId}
          colorScheme="red"
          fontWeight="normal"
        >
          {label}
        </Button>

        <FormHelperText
          role="note"
          aria-label={`${ariaLabel}-helper`}
          pl={4}
          fontSize="sm"
        >
          {helperText}
        </FormHelperText>
      </Flex>
      <input
        hidden
        multiple
        type="file"
        aria-invalid={!isValid.valid}
        accept={accept}
        id={fieldId}
        onChange={onChange}
        onClick={setInputTargetValueToEmptyString}
      />
      {children && typeof children === 'function'
        ? children(childrenStateInput, onRemove)
        : children}
    </ControlWrapper>
  );
};

export default SelectFiles;
