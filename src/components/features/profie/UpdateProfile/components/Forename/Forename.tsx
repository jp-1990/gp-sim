import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Input } from '../../../../../shared';
import { formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';

/**
 *  Forename input for profile page. Uses Input inside a form provider
 */
const Forename = () => {
  const intl = useIntl();
  return (
    <Input
      validators={validators[stateKeys.FORENAME]}
      stateKey={stateKeys.FORENAME}
      label={<FormattedMessage {...formStrings.firstName} />}
      aria-label={intl.formatMessage(formStrings.firstName)}
      w="xs"
    />
  );
};

export default Forename;
