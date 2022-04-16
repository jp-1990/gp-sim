import React, { ReactNode } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText
} from '@chakra-ui/react';
import { FormattedMessage } from 'react-intl';
import { formStrings } from '../../../../../utils/intl';

interface ControlWrapperProps {
  isValid?: boolean;
  helperText?: ReactNode;
  errorText?: ReactNode;
  label?: ReactNode;
  htmlFor: string;
}

const ControlWrapper: React.FC<ControlWrapperProps> = ({
  isValid = true,
  helperText,
  errorText = <FormattedMessage {...formStrings.invalidInput} />,
  label,
  htmlFor,
  children
}) => {
  return (
    <FormControl isInvalid={!isValid}>
      <FormLabel px={1} mb={0.5} fontSize="sm" htmlFor={htmlFor}>
        {label}
      </FormLabel>
      {children}
      {!isValid ? (
        <FormErrorMessage px={1} fontSize="sm">
          {errorText}
        </FormErrorMessage>
      ) : (
        <FormHelperText px={1} fontSize="sm">
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default ControlWrapper;
