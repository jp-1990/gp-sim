import React from 'react';
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  MergeWithAs
} from '@chakra-ui/react';
import { FormattedMessage } from 'react-intl';
import { debounce } from 'lodash';

import { useForm } from '../../Form';
import { submitButtonSubmitForm, setFormStatus } from '../../utils';
import { FormStateType, SetFormStatusType } from '../../types';
import { commonStrings } from '../../../../../utils/intl';

type SubmitButtonProps<T> = MergeWithAs<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  React.ComponentProps<any>,
  Omit<ChakraButtonProps, 'onClick'> & {
    loadingText?: React.ReactNode | string;
    onClick: (
      state: FormStateType<T>,
      setFormStatus?: SetFormStatusType
    ) => void;
  },
  React.ElementType<HTMLButtonElement>
>;

/**
 * Accepts any props accepted by ChakraUI Button. Submit action must be handled by passing an onClick function as props with a single 'state' argument.
 * @returns Function Component
 */
const SubmitButton = <StateType,>({
  loadingText,
  onClick,
  children,
  ...chakraProps
}: SubmitButtonProps<StateType>) => {
  const { state, setState } = useForm<StateType>();
  const submitDisabled = !!state.invalidFields.length || state.error;

  const isLoadingState = chakraProps.isLoading ?? state.loading;
  const isLoadingTextString =
    loadingText ??
    ((<FormattedMessage {...commonStrings.uploading} />) as unknown as string);

  const isDisabledState = chakraProps.isDisabled ?? submitDisabled;

  const onSubmit = () => {
    try {
      submitButtonSubmitForm<StateType>(
        state,
        setFormStatus(setState),
        onClick ?? (() => null)
      )();
    } catch (err) {
      setFormStatus(setState)('error', true);
    }
  };
  return (
    <ChakraButton
      test-id={`form-submit-button`}
      id={`form-submit-button`}
      _focus={{
        boxShadow: '0 0 1px 2px gray, 0 1px 1px gray'
      }}
      loadingText={isLoadingTextString}
      isLoading={isLoadingState}
      isDisabled={isDisabledState}
      {...chakraProps}
      onClick={debounce(onSubmit, 1000, {
        leading: true,
        trailing: false
      })}
    >
      {children}
    </ChakraButton>
  );
};

export default SubmitButton;
