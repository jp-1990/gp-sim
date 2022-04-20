import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Textarea } from '../../../shared';
import { formStrings, liveryStrings } from '../../../../utils/intl';
import { stateKeys, validators } from '../config';

/**
 * Description input for liveries/create page. Uses Textarea inside a form provider
 */
const LiveryDescription = () => {
  const intl = useIntl();

  return (
    <Textarea
      validators={validators.description}
      stateKey={stateKeys.DESCRIPTION}
      label={<FormattedMessage {...formStrings.description} />}
      w="3xl"
      placeholder={intl.formatMessage({
        ...liveryStrings.descriptionPlaceholder
      })}
      size="md"
      resize="none"
    />
  );
};

export default LiveryDescription;
