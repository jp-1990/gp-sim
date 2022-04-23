import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from '../../../../../shared';
import { formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';

/**
 * Price input for liveries/create page. Uses NumberInput inside a form provider
 */
const Price = () => {
  const intl = useIntl();
  return (
    <NumberInput
      validators={validators.price}
      stateKey={stateKeys.PRICE}
      label={<FormattedMessage {...formStrings.price} />}
      aria-label={intl.formatMessage(formStrings.price)}
      precision={2}
      defaultValue={intl.formatMessage({
        ...formStrings.pricePlaceholder
      })}
      w={48}
      step={0.01}
      min={0}
      allowMouseWheel
      isValidCharacter={(str) => !!str.match(/^[0-9\.]*$/g)}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

export default Price;
