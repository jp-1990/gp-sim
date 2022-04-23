import React from 'react';
import { FormattedMessage } from 'react-intl';

import { SubmitButton, useForm } from '../../../../../shared';
import { liveryStrings } from '../../../../../../utils/intl';
import { CreateLiveryDataType } from '../../../../../../types';
import { createLivery } from '../../../../../../store/livery/slice';
import { useAppDispatch } from '../../../../../../store/store';

/**
 * Submit button for liveries/create page. Uses SubmitButton inside a form provider to dispatch an action to submit the state of the form.
 */
const SubmitLivery = () => {
  const { state, setStateImmutably } = useForm();
  const dispatch = useAppDispatch();

  const onClick = async () => {
    const createLiveryInput: CreateLiveryDataType = {
      id: '',
      title: state.title,
      car: state.car,
      description: state.description,
      rating: undefined,
      downloads: 0,
      imgUrls: state.imageFiles,
      price: state.price,
      author: 'test-author',
      tags: state.searchTags,
      files: state.liveryFiles.map(({ name }: any) => name),
      publicLivery: state.publicLivery,
      privateGarage: state.privateGarage,
      garageName: state.garageName,
      garageKey: state.garageKey
    };

    setStateImmutably((prev) => {
      prev.loading = true;
      return prev;
    });
    try {
      dispatch(createLivery(createLiveryInput));
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
