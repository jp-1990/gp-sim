import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Select, useForm } from '../../../shared';
import { formStrings } from '../../../../utils/intl';
import { stateKeys, validators } from '../config';

const LiverySelectGarage = () => {
  const intl = useIntl();
  const { state } = useForm();

  if (!state[stateKeys.PRIVATE_GARAGE]) return null;
  return (
    <Select
      validators={validators.garage}
      stateKey={stateKeys.GARAGE}
      label={<FormattedMessage {...formStrings.garage} />}
      size={'md'}
      placeholder={intl.formatMessage({
        ...formStrings.garagePlaceholder
      })}
    >
      <option value="option1">Option 1</option>
    </Select>
  );
};

export default LiverySelectGarage;
