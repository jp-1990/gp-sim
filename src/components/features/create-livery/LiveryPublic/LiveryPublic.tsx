import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '../../../shared';
import { formStrings } from '../../../../utils/intl';
import { stateKeys, validators } from '../config';

const LiveryPublic = () => {
  return (
    <Checkbox
      validators={validators.publicLivery}
      stateKey={stateKeys.PUBLIC_LIVERY}
      defaultIsChecked
      colorScheme="red"
      my={1}
    >
      {<FormattedMessage {...formStrings.makeThisLiveryPublic} />}
    </Checkbox>
  );
};

export default LiveryPublic;
