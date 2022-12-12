import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useToast } from '@chakra-ui/react';

import { SubmitButton, useForm } from '../../../../../shared';
import { commonStrings, formStrings } from '../../../../../../utils/intl';

import { initialState } from '../../config';
import { UpdateProfileFormStateType } from '../../types';
import { mapUpdateProfileFormStateToRequestInput } from '../../utils';
import { selectors, thunks } from '../../../../../../store/user/slice';
import { useAppDispatch, useAppSelector } from '../../../../../../store/store';
import { RequestStatus } from '../../../../../../types';

/**
 * Submit button for profile page. Uses SubmitButton inside a form provider to submit the state of the form.
 */
const SubmitProfile = () => {
  const intl = useIntl();
  const toast = useToast({
    duration: 8000,
    isClosable: true,
    position: 'top',
    containerStyle: {
      marginTop: '1.25rem'
    }
  });
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectors.selectCurrentUserStatus);
  const isLoading = status === RequestStatus.PENDING;

  const user = {};
  const { state, resetState } = useForm<UpdateProfileFormStateType>();

  const onClick = async () => {
    try {
      if (!isLoading) {
        // prepare image files?
        const imageFiles = state.imageFiles || [];

        const updateProfileInput = {
          // map state into upload format
          ...mapUpdateProfileFormStateToRequestInput({
            formState: state,
            user
          }),
          imageFiles
        };

        await dispatch(thunks.updateCurrentUser(updateProfileInput));
        resetState(initialState);
        toast({
          title: intl.formatMessage(formStrings.updateSuccess, {
            item: intl.formatMessage(commonStrings.profile)
          }),
          status: 'success'
        });
      }
    } catch (_) {
      toast({
        title: intl.formatMessage(commonStrings.error),
        description: intl.formatMessage(formStrings.updateError, {
          item: intl.formatMessage(commonStrings.profile).toLowerCase()
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
      {<FormattedMessage {...commonStrings.saveChanges} />}
    </SubmitButton>
  );
};

export default SubmitProfile;
