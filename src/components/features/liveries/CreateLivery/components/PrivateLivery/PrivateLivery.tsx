import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Checkbox } from '../../../../../shared';
import { formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';

/**
 * Private livery checkbox for liveries/create page. Uses Checkbox inside a form provider
 */
const PrivateLivery = () => {
  const intl = useIntl();
  return (
    <Checkbox
      validators={validators.privateGarage}
      stateKey={stateKeys.PRIVATE_GARAGE}
      aria-label={intl.formatMessage(formStrings.addThisLiveryToAPrivateGarage)}
      colorScheme="red"
      my={1}
    >
      {<FormattedMessage {...formStrings.addThisLiveryToAPrivateGarage} />}
    </Checkbox>
  );
};

export default PrivateLivery;
