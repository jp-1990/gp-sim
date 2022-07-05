import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Input } from '../../../../../shared';
import { formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';

/**
 * Email input for profile page. Uses Input inside a form provider
 */
const Email = () => {
  const intl = useIntl();
  return (
    <Input
      isRequired
      validators={validators[stateKeys.EMAIL]}
      stateKey={stateKeys.EMAIL}
      label={<FormattedMessage {...formStrings.email} />}
      aria-label={intl.formatMessage(formStrings.email)}
      w="sm"
    />
  );
};

export default Email;
