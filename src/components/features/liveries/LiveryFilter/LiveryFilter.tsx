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
  NumberInput,
  NumberInputField,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Select
} from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  FiltersType,
  SetFiltersType
} from '../../../../hooks/use-livery-filters';
import { useGetCarsQuery } from '../../../../store/car/api-slice';
import { LiveriesFilterKeys as Keys, Order } from '../../../../types';
import { commonStrings } from '../../../../utils/intl';

export enum Mode {
  BASIC = 'BASIC',
  FULL = 'FULL'
}
interface Props {
  maxPriceCap?: number;
  mode: Mode;
  filters: FiltersType;
  setFilters: SetFiltersType;
}
const LiveryFilter: ComponentWithAs<'div', BoxProps & Props> = ({
  maxPriceCap = 0,
  mode,
  filters,
  setFilters,
  ...chakraProps
}) => {
  const intl = useIntl();
  const { data: cars } = useGetCarsQuery();

  // HANDLERS
  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    setFilters({ key: Keys.SEARCH, value: event.target.value });

  const onCarChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setFilters({ key: Keys.CAR, value: event.target.value });

  const onMinPriceChange = (value: string) =>
    setFilters({ key: Keys.PRICE_MIN, value });

  const onMaxPriceChange = (value: string) =>
    setFilters({ key: Keys.PRICE_MAX, value });

  const onPriceRangeChange = (value: [number, number]) => {
    const toLocaleStringConfig = {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };
    setFilters({
      key: Keys.PRICE_MIN,
      value: value[0].toLocaleString('en-GB', toLocaleStringConfig)
    });
    setFilters({
      key: Keys.PRICE_MAX,
      value: value[1].toLocaleString('en-GB', toLocaleStringConfig)
    });
  };

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
        templateRows={`repeat(${mode === Mode.BASIC ? 1 : 2}, 1fr)`}
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
            {cars?.ids.map((id) => {
              const target = cars.entities[id];
              if (!target) return null;
              return (
                <option key={id + target.name} value={target.name}>
                  {target.name}
                </option>
              );
            })}
          </Select>
        </GridItem>
        <GridItem colSpan={2} rowSpan={1}>
          <Select
            aria-label={commonStrings.createdAt.defaultMessage}
            placeholder={intl.formatMessage(commonStrings.createdAtPlaceholder)}
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
        {mode === Mode.FULL && (
          <>
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
            <GridItem colSpan={1} rowSpan={1}>
              <InputGroup aria-label={commonStrings.minPrice.defaultMessage}>
                <NumberInput
                  defaultValue={undefined}
                  min={0}
                  max={maxPriceCap}
                  value={filters.priceMin}
                  onChange={onMinPriceChange}
                  precision={2}
                  format={(str) => `£${str}`}
                >
                  <NumberInputField placeholder="Min" pl={4} pr={0} />
                </NumberInput>
              </InputGroup>
            </GridItem>
            <GridItem colSpan={1} rowSpan={1}>
              <InputGroup aria-label={commonStrings.maxPrice.defaultMessage}>
                <NumberInput
                  defaultValue={undefined}
                  min={0}
                  max={maxPriceCap}
                  value={filters.priceMax}
                  onChange={onMaxPriceChange}
                  precision={2}
                  format={(str) => `£${str}`}
                >
                  <NumberInputField placeholder="Max" pl={4} pr={0} />
                </NumberInput>
              </InputGroup>
            </GridItem>
            <GridItem colSpan={4} rowSpan={1} display="flex">
              <RangeSlider
                // eslint-disable-next-line jsx-a11y/aria-proptypes
                aria-label={['min', 'max']}
                colorScheme="pink"
                defaultValue={[+filters.priceMin, maxPriceCap]}
                min={0}
                max={maxPriceCap}
                step={0.01}
                value={[+filters.priceMin, +filters.priceMax]}
                onChange={onPriceRangeChange}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
            </GridItem>
          </>
        )}
      </Grid>
    </chakra.section>
  );
};

export default LiveryFilter;
