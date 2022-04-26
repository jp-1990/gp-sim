import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Select, useForm } from '../../../../../shared';
import { formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';

/**
 * Select garage input for liveries/create page. Uses Select inside a form provider
 */
const SelectGarage = () => {
  const intl = useIntl();
  const { state } = useForm();

  if (!state[stateKeys.PRIVATE_GARAGE]) return null;
  return (
    <Select
      validators={validators.garage}
      stateKey={stateKeys.GARAGE}
      label={<FormattedMessage {...formStrings.garage} />}
      aria-label={intl.formatMessage(formStrings.garage)}
      size={'md'}
      isDisabled={state.garageKey}
      placeholder={intl.formatMessage({
        ...formStrings.garagePlaceholder
      })}
    >
      <option value="option1">Option 1</option>
    </Select>
  );
};

export default SelectGarage;