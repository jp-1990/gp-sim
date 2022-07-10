import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Textarea } from '../../../../../shared';
import { formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';

/**
 * About input for profile page. Uses Textarea inside a form provider
 */
const About = () => {
  const intl = useIntl();

  return (
    <Textarea
      validators={validators[stateKeys.ABOUT]}
      stateKey={stateKeys.ABOUT}
      aria-label={intl.formatMessage(formStrings.about)}
      label={<FormattedMessage {...formStrings.about} />}
      placeholder={intl.formatMessage({
        ...formStrings.aboutPlaceholder
      })}
      size="md"
      h={36}
      resize="none"
    />
  );
};

export default About;
