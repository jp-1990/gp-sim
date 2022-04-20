/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { Checkbox, useForm } from '../../../../../shared';
import { formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';

/**
 * Public checkbox for liveries/create page. Uses Checkbox inside a form provider
 */
const PublicLivery = () => {
  const { setState } = useForm();

  useEffect(() => {
    setState((prev) => {
      const prevState = { ...prev };
      prevState[stateKeys.PUBLIC_LIVERY] = true;
      return prevState;
    });
  }, []);

  return (
    <Checkbox
      validators={validators.publicLivery}
      stateKey={stateKeys.PUBLIC_LIVERY}
      colorScheme="red"
      my={1}
    >
      {<FormattedMessage {...formStrings.makeThisLiveryPublic} />}
    </Checkbox>
  );
};

export default PublicLivery;
