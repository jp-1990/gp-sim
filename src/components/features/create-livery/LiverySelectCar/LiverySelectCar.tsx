import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Select } from '../../../shared';
import { formStrings } from '../../../../utils/intl';
import { stateKeys, validators } from '../config';
import { CarDataType } from '../../../../types';

interface Props {
  ids: string[];
  cars: Record<string, CarDataType>;
}
const LiverySelectCar: React.FC<Props> = ({ ids, cars }) => {
  const intl = useIntl();
  return (
    <Select
      isRequired
      validators={validators.car}
      stateKey={stateKeys.CAR}
      label={<FormattedMessage {...formStrings.car} />}
      placeholder={intl.formatMessage({
        ...formStrings.carPlaceholder
      })}
      w="sm"
    >
      {ids.map((id) => {
        const targetCar = cars[id];
        return (
          <option key={id + targetCar.name} value={targetCar.name}>
            {targetCar.name}
          </option>
        );
      })}
    </Select>
  );
};

export default LiverySelectCar;
