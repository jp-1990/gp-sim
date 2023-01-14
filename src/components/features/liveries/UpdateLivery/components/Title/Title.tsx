import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Input } from '../../../../../shared';
import { formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';

/**
 * Title input for liveries/create page. Uses Input inside a form provider
 */
const Title = () => {
  const intl = useIntl();
  return (
    <Input
      isRequired
      validators={validators.title}
      stateKey={stateKeys.TITLE}
      label={<FormattedMessage {...formStrings.title} />}
      aria-label={intl.formatMessage(formStrings.title)}
      placeholder={intl.formatMessage({
        ...formStrings.titlePlaceholder
      })}
      w="sm"
    />
  );
};

export default Title;
