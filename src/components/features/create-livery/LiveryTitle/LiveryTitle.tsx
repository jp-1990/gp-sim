import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Input } from '../../../shared';
import { formStrings } from '../../../../utils/intl';
import { stateKeys, validators } from '../config';

/**
 * Title input for liveries/create page. Uses Input inside a form provider
 */
const LiveryTitle = () => {
  const intl = useIntl();
  return (
    <Input
      isRequired
      validators={validators.title}
      stateKey={stateKeys.TITLE}
      label={<FormattedMessage {...formStrings.title} />}
      placeholder={intl.formatMessage({
        ...formStrings.titlePlaceholder
      })}
      w="sm"
    />
  );
};

export default LiveryTitle;
