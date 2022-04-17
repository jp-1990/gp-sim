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
  selectImagesOnChange,
  selectImagesRemoveByIndex
} from '../../utils';
import { DefaultInputProps, FormValueType } from '../../types';
import { commonStrings, formStrings } from '../../../../../utils/intl';

interface SelectImageProps<T extends string> extends DefaultInputProps {
  max: number;
  helperText?: React.ReactNode;
  children?:
    | ((
        state: StateWithStateKey<T> | undefined,
        removeImageByIndex: (index: number) => void
      ) => React.ReactNode)
    | ReactNode;
}
/**
 * Provides a button to open the file explorer, where a user should select images. Images will be set to state using the provided stateKey prop, with their length constrained by the max prop.
 * @param {SelectImageProps['max']} SelectImageProps.max - number. the maximum number of images to allow
 * @param {SelectImageProps['label']} SelectImageProps.label - ReactNode. Text to display in the user prompt button
 * @param {SelectImageProps['helperText']} SelectImageProps.helperText - ReactNode. Text to display to the right of the button
 * @param {SelectImageProps['stateKey']} SelectImageProps.stateKey - string. used to set values to state
 * @param {SelectImageProps['validators']} SelectImageProps.validators - array of validators (strings)
 * @param {SelectImageProps['children']} SelectImageProps.children - function accepting state and a function used to removed images from state by index. OR ReactNode
 * @returns Function Component
 */
const SelectImages = <T extends string>({
  max,
  label = <FormattedMessage {...commonStrings.selectImages} />,
  helperText = <FormattedMessage {...formStrings.selectImageHelperText} />,
  stateKey,
  validators,
  children
}: SelectImageProps<T>) => {
  const { state, setState } = useForm();
  const fieldId = `${stateKey}-imageUpload`;

  useEffect(() => {
    setState((prev) => {
      const prevState = { ...prev };
      prevState[stateKey] = [] as File[];
      return prevState;
    });
  }, []);

  const onChange = selectImagesOnChange(setState, stateKey, max);
  const onClick = (e: React.MouseEvent) =>
    ((e.target as HTMLInputElement).value = '');
  const onRemove = selectImagesRemoveByIndex(setState, stateKey, max);
  const isValid = isFieldValid(state[stateKey], validators);

  useEffect(() => {
    if (!isValid.valid) addToInvalidFields(stateKey, setState);
    if (isValid.valid) removeFromInvalidFields(stateKey, setState);
  }, [isValid.valid]);

  const childrenStateInput = isStateWithStateKey<T>(state, stateKey)
    ? state
    : undefined;

  return (
    <ControlWrapper
      htmlFor={fieldId}
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
        <FormHelperText pl={4} fontSize="sm">
          {helperText}
        </FormHelperText>
      </Flex>
      <input
        hidden
        multiple
        type="file"
        accept="image/*"
        id={fieldId}
        onChange={onChange}
        onClick={onClick}
      />
      {children && typeof children === 'function'
        ? children(childrenStateInput, onRemove)
        : children}
    </ControlWrapper>
  );
};

export default SelectImages;

type StateWithStateKey<T extends string> = FormValueType['state'] &
  Record<T, File[]>;
const isStateWithStateKey = <T extends string>(
  state: FormValueType['state'],
  stateKey: string
): state is StateWithStateKey<T> => {
  return (state as StateWithStateKey<T>)[stateKey] !== undefined;
};
