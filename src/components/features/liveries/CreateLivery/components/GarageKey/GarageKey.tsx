import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Input, useForm } from '../../../../../shared';
import { formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';

/**
 * GarageKey input for liveries/create page. Uses Input inside a form provider
 */
const GarageKey = () => {
  const intl = useIntl();
  const { state } = useForm();

  if (!state[stateKeys.PRIVATE_GARAGE]) return null;
  return (
    <Input
      validators={validators.garageKey}
      stateKey={stateKeys.GARAGE_KEY}
      label={<FormattedMessage {...formStrings.garageKey} />}
      placeholder={intl.formatMessage({
        ...formStrings.garageKey
      })}
    />
  );
};

export default GarageKey;
