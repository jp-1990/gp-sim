/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Checkbox, useForm } from '../../../../../shared';
import { formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';

/**
 * Public checkbox for liveries/update page. Uses Checkbox inside a form provider
 */
const PublicLivery = () => {
  const intl = useIntl();
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
      aria-label={intl.formatMessage(formStrings.makeThisLiveryPublic)}
      colorScheme="red"
      my={1}
    >
      {<FormattedMessage {...formStrings.makeThisLiveryPublic} />}
    </Checkbox>
  );
};

export default PublicLivery;
