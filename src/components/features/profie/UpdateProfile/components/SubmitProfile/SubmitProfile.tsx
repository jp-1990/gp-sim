import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useToast } from '@chakra-ui/react';

import { SubmitButton, useForm } from '../../../../../shared';
import { commonStrings, formStrings } from '../../../../../../utils/intl';

import { UpdateProfileFormStateType } from '../../types';
import { mapUpdateProfileFormStateToRequestInput } from '../../utils';
import { thunks } from '../../../../../../store/user/slice';
import { useAppDispatch } from '../../../../../../store/store';
import { RequestStatus } from '../../../../../../types';

/**
 * Submit button for profile page. Uses SubmitButton inside a form provider to submit the state of the form.
 */
const SubmitProfile = () => {
  const [isLoading, setIsLoading] = useState(false);

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

  const user = {};
  const { state } = useForm<UpdateProfileFormStateType>();

  const onClick = async () => {
    setIsLoading(true);
    try {
      if (!isLoading) {
        const updateProfileInput = {
          // map state into upload format
          ...mapUpdateProfileFormStateToRequestInput({
            formState: state,
            user
          })
        };

        // append values to form data
        const formData = new FormData();
        for (const [key, value] of Object.entries(updateProfileInput)) {
          formData.append(key, `${value}`);
        }
        for (const image of state.imageFiles || []) {
          if (image) {
            const buffer = await image.arrayBuffer();
            const blob = new Blob([new Uint8Array(buffer)], {
              type: image.type
            });
            formData.append('imageFile', blob, image.name);
          }
        }

        const {
          meta: { requestStatus }
        } = await dispatch(thunks.updateCurrentUser(formData));

        if (requestStatus === RequestStatus.REJECTED) throw new Error();

        toast({
          title: intl.formatMessage(formStrings.updateSuccess, {
            item: intl.formatMessage(commonStrings.profile)
          }),
          status: 'success'
        });
        setIsLoading(false);
      }
    } catch (_) {
      toast({
        title: intl.formatMessage(commonStrings.error),
        description: intl.formatMessage(formStrings.updateError, {
          item: intl.formatMessage(commonStrings.profile).toLowerCase()
        }),
        status: 'error'
      });
      setIsLoading(false);
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
