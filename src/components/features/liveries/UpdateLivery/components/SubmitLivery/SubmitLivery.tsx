import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { SubmitButton, useForm } from '../../../../../shared';
import {
  liveryStrings,
  formStrings,
  commonStrings
} from '../../../../../../utils/intl';
import { thunks } from '../../../../../../store/livery/slice';
import { UpdateLiveryFormStateType } from '../../types';
import { initialState, stateKeys } from '../../config';
import { useAppDispatch } from '../../../../../../store/store';
import { LiveryDataType, RequestStatus } from '../../../../../../types';

/**
 * Submit button for liveries/update page. Uses SubmitButton inside a form provider to submit the state of the form.
 */
const SubmitLivery = ({ livery }: { livery: LiveryDataType }) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
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
  const { state, resetState } = useForm<UpdateLiveryFormStateType>();

  const onClick = async () => {
    setIsLoading(true);
    try {
      const updateLiveryInput = {
        title:
          livery.title === state[stateKeys.TITLE] ? undefined : state.title,
        description:
          livery.description === state[stateKeys.DESCRIPTION]
            ? undefined
            : state.description,
        isPublic:
          livery.isPublic === state[stateKeys.PUBLIC_LIVERY]
            ? undefined
            : state.isPublic,
        tags:
          livery.tags === state[stateKeys.SEARCH_TAGS] ? undefined : state.tags
      };

      // append values to form data
      const formData = new FormData();
      for (const [key, value] of Object.entries(updateLiveryInput)) {
        formData.append(key, `${value}`);
      }

      let imagesToRemove = ['image-0', 'image-1', 'image-2', 'image-3'];
      for (const image of state[stateKeys.IMAGE_FILES] || []) {
        if (typeof image === 'string') {
          const regex = /(image-[0-9])/g;
          const img = (image.match(regex) || [])[0];
          imagesToRemove = imagesToRemove.filter((i) => i !== img);
        }
        if (image instanceof File) {
          const buffer = await image.arrayBuffer();
          const blob = new Blob([new Uint8Array(buffer)], { type: image.type });
          formData.append('imageFiles', blob, image.name);
        }
      }

      for (const image of imagesToRemove) {
        formData.append('imagesToRemove', image);
      }

      // make request
      const {
        meta: { requestStatus }
      } = await dispatch(
        thunks.updateLiveryById({ id: livery.id, data: formData })
      );

      if (requestStatus === RequestStatus.REJECTED) throw new Error();

      resetState(initialState);
      setIsLoading(false);
      router.back();

      toast({
        title: intl.formatMessage(formStrings.updateSuccess, {
          item: intl.formatMessage(commonStrings.livery)
        }),
        description: `${state.title}`,
        status: 'success'
      });
    } catch (_) {
      toast({
        title: intl.formatMessage(commonStrings.error),
        description: intl.formatMessage(formStrings.updateError, {
          item: intl.formatMessage(commonStrings.livery)
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
      {<FormattedMessage {...liveryStrings.updateLivery} />}
    </SubmitButton>
  );
};

export default SubmitLivery;
