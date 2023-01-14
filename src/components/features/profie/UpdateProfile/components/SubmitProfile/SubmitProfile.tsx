import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useToast } from '@chakra-ui/react';

import { SubmitButton, useForm } from '../../../../../shared';
import { commonStrings, formStrings } from '../../../../../../utils/intl';

import { UpdateProfileFormStateType } from '../../types';
import { thunks } from '../../../../../../store/user/slice';
import { useAppDispatch } from '../../../../../../store/store';
import { RequestStatus, UserDataType } from '../../../../../../types';
import { stateKeys } from '../../config';

const { ABOUT, FORENAME, SURNAME, DISPLAY_NAME, EMAIL, IMAGE_FILES } =
  stateKeys;

/**
 * Submit button for profile page. Uses SubmitButton inside a form provider to submit the state of the form.
 */
const SubmitProfile = ({
  user
}: {
  user: Omit<
    UserDataType,
    'createdAt' | 'garages' | 'id' | 'lastLogin' | 'liveries' | 'updatedAt'
  >;
}) => {
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

  const { state } = useForm<UpdateProfileFormStateType>();

  const onClick = async () => {
    setIsLoading(true);
    try {
      if (!isLoading) {
        const updateProfileInput = {
          about: user.about === state[ABOUT] ? undefined : state[ABOUT],
          forename:
            user.forename === state[FORENAME] ? undefined : state[FORENAME],
          surname: user.surname === state[SURNAME] ? undefined : state[SURNAME],
          displayName:
            user.displayName === state[DISPLAY_NAME]
              ? undefined
              : state[DISPLAY_NAME],
          email: user.email === state[EMAIL] ? undefined : state[EMAIL],
          removeImage: false
        };

        // append values to form data
        const formData = new FormData();

        if (!state[IMAGE_FILES]?.length) updateProfileInput.removeImage = true;

        for (const image of state[IMAGE_FILES] || []) {
          if (image instanceof File) {
            updateProfileInput.removeImage = true;
            const buffer = await image.arrayBuffer();
            const blob = new Blob([new Uint8Array(buffer)], {
              type: image.type
            });
            formData.append('imageFile', blob, image.name);
          }
        }

        for (const [key, value] of Object.entries(updateProfileInput)) {
          formData.append(key, `${value}`);
        }

        // make request
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
