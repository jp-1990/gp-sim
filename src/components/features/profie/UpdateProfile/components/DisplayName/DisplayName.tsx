import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Input } from '../../../../../shared';
import { formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';

/**
 * Display Name input for profile page. Uses Input inside a form provider
 */
const DisplayName = () => {
  const intl = useIntl();
  return (
    <Input
      isRequired
      validators={validators[stateKeys.DISPLAY_NAME]}
      stateKey={stateKeys.DISPLAY_NAME}
      label={<FormattedMessage {...formStrings.displayName} />}
      aria-label={intl.formatMessage(formStrings.displayName)}
      w="xs"
    />
  );
};

export default DisplayName;
