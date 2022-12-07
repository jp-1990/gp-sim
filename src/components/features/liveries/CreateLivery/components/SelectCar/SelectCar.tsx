import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Select } from '../../../../../shared';
import { formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';
import { useAppSelector } from '../../../../../../store/store';
import { selectors } from '../../../../../../store/car/slice';

/**
 * Select car input for liveries/create page. Uses Select inside a form provider
 */
const SelectCar: React.FC = () => {
  const [safeToRender, setSafeToRender] = useState<boolean | undefined>();
  const intl = useIntl();

  const cars = useAppSelector(selectors.selectCars);

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
        cars.map((car) => {
          return (
            <option key={car.id + car.name} value={car.name}>
              {car.name}
            </option>
          );
        })}
    </Select>
  );
};

export default SelectCar;
