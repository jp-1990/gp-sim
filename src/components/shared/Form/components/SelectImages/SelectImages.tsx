/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from '@chakra-ui/react';
import React, { ReactNode, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { useForm } from '../../Form';
import { selectImagesOnChange, selectImagesRemoveByIndex } from '../../utils';
import { DefaultInputProps, FormValueType } from '../../types';
import { commonStrings } from '../../../../../utils/intl';

interface SelectImageProps<T extends string> extends DefaultInputProps {
  max: number;
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
 * @param {SelectImageProps['stateKey']} SelectImageProps.stateKey - string. used to set values to state
 * @param {SelectImageProps['children']} SelectImageProps.children - function accepting state and a function used to removed images from state by index. OR ReactNode
 * @returns Function Component
 */
const SelectImages = <T extends string>({
  max,
  label = <FormattedMessage {...commonStrings.selectImages} />,
  stateKey,
  children
}: SelectImageProps<T>) => {
  const { state, setState } = useForm();
  useEffect(() => {
    setState((prev) => {
      const prevState = { ...prev };
      prevState[stateKey] = [] as File[];
      return prevState;
    });
  }, []);

  const onChange = selectImagesOnChange(setState, stateKey, max);
  const onRemove = selectImagesRemoveByIndex(setState, stateKey, max);

  const childrenStateInput = isStateWithStateKey<T>(state, stateKey)
    ? state
    : undefined;

  return (
    <>
      <Button as="label" w="2xs" lineHeight={1} htmlFor="imageUpload">
        {label}
      </Button>
      <input
        hidden
        multiple
        type="file"
        accept="image/*"
        id="imageUpload"
        onChange={onChange}
      />
      {children && typeof children === 'function'
        ? children(childrenStateInput, onRemove)
        : children}
    </>
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
