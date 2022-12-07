import { SearchIcon } from '@chakra-ui/icons';
import {
  BoxProps,
  chakra,
  ComponentWithAs,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftElement,
  Select
} from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';
import { useIntl } from 'react-intl';
import {
  FiltersType,
  SetFiltersType
} from '../../../../hooks/use-livery-filters';
import { selectors } from '../../../../store/car/slice';
import { useAppSelector } from '../../../../store/store';
import { LiveriesFilterKeys as Keys, Order } from '../../../../types';
import { commonStrings } from '../../../../utils/intl';

export enum Mode {
  BASIC = 'BASIC',
  FULL = 'FULL'
}
interface Props {
  mode: Mode;
  filters: FiltersType;
  setFilters: SetFiltersType;
}
const LiveryFilter: ComponentWithAs<'div', BoxProps & Props> = ({
  mode,
  filters,
  setFilters,
  ...chakraProps
}) => {
  const intl = useIntl();
  const cars = useAppSelector(selectors.selectCars);

  // HANDLERS
  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    setFilters({ key: Keys.SEARCH, value: event.target.value });

  const onCarChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setFilters({ key: Keys.CAR, value: event.target.value });

  const onCreatedChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (value !== Order.ASC && value !== Order.DESC) return;
    setFilters({ key: Keys.CREATED, value });
  };

  const onRatingChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setFilters({ key: Keys.RATING, value: event.target.value });

  return (
    <chakra.section
      pt={8}
      w="5xl"
      display="flex"
      justifyContent="flex-start"
      {...chakraProps}
    >
      <Grid
        templateColumns="repeat(9, 1fr)"
        templateRows={`repeat(1, 1fr)`}
        gap={4}
        w="5xl"
      >
        <GridItem colSpan={2} rowSpan={1}>
          <InputGroup aria-label={commonStrings.search.defaultMessage}>
            <InputLeftElement
              pointerEvents="none"
              color="gray.300"
              fontSize="1.2em"
            >
              <SearchIcon />
            </InputLeftElement>
            <Input
              placeholder={intl.formatMessage(commonStrings.searchPlaceholder)}
              onChange={onSearchChange}
              value={filters.search}
            />
          </InputGroup>
        </GridItem>
        <GridItem colSpan={3} rowSpan={1}>
          <Select
            aria-label={commonStrings.selectCar.defaultMessage}
            placeholder={intl.formatMessage(commonStrings.selectCarPlaceholder)}
            onChange={onCarChange}
            value={filters.car}
          >
            {cars.map((car) => {
              return (
                <option key={car.id + car.name} value={car.name}>
                  {car.name}
                </option>
              );
            })}
          </Select>
        </GridItem>

        {mode === Mode.FULL && (
          <>
            <GridItem colSpan={2} rowSpan={1}>
              <Select
                aria-label={commonStrings.createdAt.defaultMessage}
                placeholder={intl.formatMessage(
                  commonStrings.createdAtPlaceholder
                )}
                value={filters.created}
                onChange={onCreatedChange}
              >
                <option value={Order.ASC}>
                  {intl.formatMessage(commonStrings.createdAtMostRecent)}
                </option>
                <option value={Order.DESC}>
                  {intl.formatMessage(commonStrings.createdAtOldest)}
                </option>
              </Select>
            </GridItem>
            <GridItem colSpan={2} rowSpan={1}>
              <Select
                aria-label={commonStrings.rating.defaultMessage}
                placeholder={intl.formatMessage(
                  commonStrings.ratingPlaceholder
                )}
                value={filters.rating}
                onChange={onRatingChange}
              >
                {[5, 4, 3, 2, 1].map((n) => {
                  return (
                    <option key={n} value={n}>
                      {intl.formatMessage(commonStrings.ratingValue, {
                        stars: n
                      })}
                    </option>
                  );
                })}
              </Select>
            </GridItem>
          </>
        )}
      </Grid>
    </chakra.section>
  );
};

export default LiveryFilter;
