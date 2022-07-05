import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Input } from '../../../../../shared';
import { formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';

/**
 * Surname input for profile page. Uses Input inside a form provider
 */
const Surname = () => {
  const intl = useIntl();
  return (
    <Input
      validators={validators[stateKeys.SURNAME]}
      stateKey={stateKeys.SURNAME}
      label={<FormattedMessage {...formStrings.lastName} />}
      aria-label={intl.formatMessage(formStrings.lastName)}
      w="xs"
    />
  );
};

export default Surname;
