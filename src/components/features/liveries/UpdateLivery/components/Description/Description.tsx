import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Textarea } from '../../../../../shared';
import { formStrings, liveryStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';

/**
 * Description input for liveries/update page. Uses Textarea inside a form provider
 */
const Description = () => {
  const intl = useIntl();

  return (
    <Textarea
      validators={validators.description}
      stateKey={stateKeys.DESCRIPTION}
      aria-label={intl.formatMessage(formStrings.description)}
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

export default Description;
