/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useUser } from '@auth0/nextjs-auth0';

import { SubmitButton, useForm } from '../../../../../shared';
import { liveryStrings } from '../../../../../../utils/intl';
import { postLiveryThunk } from '../../../../../../store/livery/slice';
import { useAppDispatch } from '../../../../../../store/store';
import {
  mapCreateLiveryFormStateToActionInput,
  zipLiveryFiles
} from '../../utils';
import { CreateLiveryFormStateType } from '../../types';

/**
 * Submit button for liveries/create page. Uses SubmitButton inside a form provider to dispatch an action to submit the state of the form.
 */
const SubmitLivery = () => {
  const { user } = useUser();
  const { state, setStateImmutably } = useForm<CreateLiveryFormStateType>();
  const dispatch = useAppDispatch();

  const onClick = async () => {
    // prepare livery files
    const liveryZip = await zipLiveryFiles({
      folderName: state.title,
      liveryFiles: state.liveryFiles
    });

    // prepare image files?
    const imageFiles = state.imageFiles || [];

    const createLiveryInput = {
      // map state into upload format
      ...mapCreateLiveryFormStateToActionInput({
        formState: state,
        user
      }),
      liveryZip,
      imageFiles
    };

    setStateImmutably((prev) => {
      prev.loading = true;
      return prev;
    });
    try {
      dispatch(postLiveryThunk(createLiveryInput));
      setStateImmutably((prev) => {
        prev.loading = false;
        return prev;
      });
    } catch (err) {
      setStateImmutably((prev) => {
        prev.loading = false;
        prev.error = true;
        return prev;
      });
    }
  };

  return (
    <SubmitButton onClick={onClick} colorScheme="red" w="2xs" lineHeight={1}>
      {<FormattedMessage {...liveryStrings.uploadLivery} />}
    </SubmitButton>
  );
};

export default SubmitLivery;
