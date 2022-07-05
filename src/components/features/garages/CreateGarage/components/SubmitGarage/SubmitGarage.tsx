import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useUser } from '@auth0/nextjs-auth0';
import { useToast } from '@chakra-ui/react';

import { SubmitButton, useForm } from '../../../../../shared';
import {
  commonStrings,
  formStrings,
  garageStrings
} from '../../../../../../utils/intl';

import { useCreateGarageMutation } from '../../../../../../store/garage/api-slice';

import { initialState } from '../../config';
import { CreateGarageFormStateType } from '../../types';
import { mapCreateGarageFormStateToRequestInput } from '../../utils';

/**
 * Submit button for liveries/create page. Uses SubmitButton inside a form provider to submit the state of the form.
 */
const SubmitGarage = () => {
  const intl = useIntl();
  const toast = useToast({
    duration: 8000,
    isClosable: true,
    position: 'top',
    containerStyle: {
      marginTop: '1.25rem'
    }
  });
  const { user } = useUser();
  const { state, resetState } = useForm<CreateGarageFormStateType>();
  const [createGarage, { isLoading }] = useCreateGarageMutation();

  const onClick = async () => {
    try {
      if (!isLoading) {
        // prepare image files?
        const imageFiles = state.imageFiles || [];

        const createGarageInput = {
          // map state into upload format
          ...mapCreateGarageFormStateToRequestInput({
            formState: state,
            user
          }),
          imageFiles
        };

        await createGarage(createGarageInput).unwrap();
        resetState(initialState);
        toast({
          title: intl.formatMessage(formStrings.createSuccess, {
            item: intl.formatMessage(commonStrings.garage)
          }),
          description: `${state.title}`,
          status: 'success'
        });
      }
    } catch (_) {
      toast({
        title: intl.formatMessage(commonStrings.error),
        description: intl.formatMessage(formStrings.createError, {
          item: intl.formatMessage(commonStrings.garage)
        }),
        status: 'error'
      });
    }
  };

  return (
    <SubmitButton
      onClick={onClick}
      colorScheme="red"
      w="2xs"
      lineHeight={1}
      isLoading={isLoading}
    >
      {<FormattedMessage {...garageStrings.createGarage} />}
    </SubmitButton>
  );
};

export default SubmitGarage;
