import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Textarea } from '../../../../../shared';
import { commonStrings, formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';

/**
 * Description input for garages/create page. Uses Textarea inside a form provider
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
      placeholder={intl.formatMessage(
        {
          ...formStrings.descriptionPlaceholder
        },
        { item: intl.formatMessage({ ...commonStrings.garage }) }
      )}
      size="md"
      resize="none"
    />
  );
};

export default Description;
