import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useToast } from '@chakra-ui/react';

import { SubmitButton, useForm } from '../../../../../shared';
import {
  liveryStrings,
  formStrings,
  commonStrings
} from '../../../../../../utils/intl';
import { thunks } from '../../../../../../store/livery/slice';
import {
  mapCreateLiveryFormStateToRequestInput,
  zipLiveryFiles
} from '../../utils';
import { CreateLiveryFormStateType } from '../../types';
import { initialState } from '../../config';
import { useAppDispatch } from '../../../../../../store/store';

/**
 * Submit button for liveries/create page. Uses SubmitButton inside a form provider to submit the state of the form.
 */
const SubmitLivery = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const intl = useIntl();
  const toast = useToast({
    duration: 8000,
    isClosable: true,
    position: 'top',
    containerStyle: {
      marginTop: '1.25rem'
    }
  });
  const user = {};
  const { state, resetState } = useForm<CreateLiveryFormStateType>();

  const onClick = async () => {
    setIsLoading(true);
    try {
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

      await dispatch(thunks.createLivery(createLiveryInput));
      resetState(initialState);
      toast({
        title: intl.formatMessage(formStrings.createSuccess, {
          item: intl.formatMessage(commonStrings.livery)
        }),
        description: `${state.title}`,
        status: 'success'
      });

      setIsLoading(false);
    } catch (_) {
      toast({
        title: intl.formatMessage(commonStrings.error),
        description: intl.formatMessage(formStrings.createError, {
          item: intl.formatMessage(commonStrings.livery)
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
      {<FormattedMessage {...liveryStrings.uploadLivery} />}
    </SubmitButton>
  );
};

export default SubmitLivery;
