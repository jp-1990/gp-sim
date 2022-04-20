import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '../../../shared';
import { formStrings } from '../../../../utils/intl';
import { stateKeys, validators } from '../config';

/**
 * Private livery checkbox for liveries/create page. Uses Checkbox inside a form provider
 */
const LiveryPrivate = () => {
  return (
    <Checkbox
      validators={validators.privateGarage}
      stateKey={stateKeys.PRIVATE_GARAGE}
      colorScheme="red"
      my={1}
    >
      {<FormattedMessage {...formStrings.addThisLiveryToAPrivateGarage} />}
    </Checkbox>
  );
};

export default LiveryPrivate;
