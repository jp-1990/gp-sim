import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useUser } from '@auth0/nextjs-auth0';
import { useToast } from '@chakra-ui/react';

import { SubmitButton, useForm } from '../../../../../shared';
import { liveryStrings } from '../../../../../../utils/intl';
import { useCreateLiveryMutation } from '../../../../../../store/livery/api-slice';
import {
  mapCreateLiveryFormStateToRequestInput,
  zipLiveryFiles
} from '../../utils';
import { CreateLiveryFormStateType } from '../../types';
import { initialState } from '../../config';

/**
 * Submit button for liveries/create page. Uses SubmitButton inside a form provider to submit the state of the form.
 */
const SubmitLivery = () => {
  const toast = useToast({
    duration: 8000,
    isClosable: true,
    position: 'top',
    containerStyle: {
      marginTop: '1.25rem'
    }
  });
  const { user } = useUser();
  const { state, resetState } = useForm<CreateLiveryFormStateType>();
  const [createLivery, { isLoading }] = useCreateLiveryMutation();

  const onClick = async () => {
    try {
      if (!isLoading) {
        // prepare livery files
        const liveryZip = await zipLiveryFiles({
          folderName: state.title,
          liveryFiles: state.liveryFiles
        });

        // prepare image files?
        const imageFiles = state.imageFiles || [];

        const createLiveryInput = {
          // map state into upload format
          ...mapCreateLiveryFormStateToRequestInput({
            formState: state,
            user
          }),
          liveryZip,
          imageFiles
        };

        await createLivery(createLiveryInput).unwrap();
        resetState(initialState);
        toast({
          title: 'Livery successfully created',
          description: `${state.title}`,
          status: 'success'
        });
      }
    } catch (_) {
      toast({
        title: 'Something went wrong!',
        description: `We're sorry, something went wrong when creating your livery`,
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
      {<FormattedMessage {...liveryStrings.uploadLivery} />}
    </SubmitButton>
  );
};

export default SubmitLivery;
