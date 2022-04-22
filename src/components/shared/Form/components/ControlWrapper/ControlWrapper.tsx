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
  isRequired?: boolean;
  helperText?: ReactNode;
  errorText?: ReactNode;
  label?: ReactNode;
  ariaLabel?: string;
  htmlFor: string;
}

const ControlWrapper: React.FC<ControlWrapperProps> = ({
  isValid = true,
  isRequired = false,
  helperText,
  errorText = <FormattedMessage {...formStrings.invalidInput} />,
  label,
  ariaLabel,
  htmlFor,
  children
}) => {
  return (
    <FormControl isInvalid={!isValid} isRequired={isRequired}>
      <FormLabel px={1} mb={label ? 0.5 : 0} fontSize="sm" htmlFor={htmlFor}>
        {label}
      </FormLabel>
      {children}
      {!isValid && (
        <FormErrorMessage
          role="status"
          px={1}
          fontSize="sm"
          aria-label={`${ariaLabel}-error`}
        >
          {errorText}
        </FormErrorMessage>
      )}
      {isValid && helperText && (
        <FormHelperText
          role="note"
          px={1}
          fontSize="sm"
          aria-label={`${ariaLabel}-helper`}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default ControlWrapper;
