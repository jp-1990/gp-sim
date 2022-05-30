import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Select } from '../../../../../shared';
import { formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';
import { useAppSelector } from '../../../../../../store/store';
import {
  selectAllCars,
  selectCarIds
} from '../../../../../../store/car/api-slice';
import { EntityId } from '@reduxjs/toolkit';

/**
 * Select car input for liveries/create page. Uses Select inside a form provider
 */
const SelectCar: React.FC = () => {
  const [safeToRender, setSafeToRender] = useState<boolean | undefined>();
  const intl = useIntl();

  const cars = useAppSelector(selectAllCars);
  const ids = useAppSelector(selectCarIds);

  useEffect(() => {
    setSafeToRender(true);
  }, []);

  return (
    <Select
      isRequired
      validators={validators.car}
      stateKey={stateKeys.CAR}
      label={<FormattedMessage {...formStrings.car} />}
      aria-label={intl.formatMessage(formStrings.carPlaceholder)}
      placeholder={intl.formatMessage({
        ...formStrings.carPlaceholder
      })}
      w="sm"
    >
      {safeToRender &&
        ids.map((id: EntityId) => {
          const targetCar = cars[+id];
          return (
            <option key={id + targetCar.name} value={targetCar.name}>
              {targetCar.name}
            </option>
          );
        })}
    </Select>
  );
};

export default SelectCar;
