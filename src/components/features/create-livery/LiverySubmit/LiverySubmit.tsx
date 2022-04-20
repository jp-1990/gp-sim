import React from 'react';
import { FormattedMessage } from 'react-intl';

import { SubmitButton, useForm } from '../../../shared';
import { liveryStrings } from '../../../../utils/intl';
import { CreateLiveryDataType } from '../../../../types';
import { useDispatch } from 'react-redux';
import { createLivery } from '../../../../store/livery/slice';

/**
 * Submit button for liveries/create page. Uses SubmitButton inside a form provider to dispatch an action to submit the state of the form.
 */
const LiverySubmit = () => {
  const { state, setState } = useForm();
  const dispatch = useDispatch();

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

    setState((prev) => {
      const prevState = { ...prev };
      prevState.loading = true;
      return prevState;
    });
    try {
      dispatch(createLivery(createLiveryInput));
      setState((prev) => {
        const prevState = { ...prev };
        prevState.loading = false;
        return prevState;
      });
    } catch (err) {
      setState((prev) => {
        const prevState = { ...prev };
        prevState.loading = false;
        prevState.error = true;
        return prevState;
      });
    }
  };

  return (
    <SubmitButton onClick={onClick} colorScheme="red" w="2xs" lineHeight={1}>
      {<FormattedMessage {...liveryStrings.uploadLivery} />}
    </SubmitButton>
  );
};

export default LiverySubmit;
