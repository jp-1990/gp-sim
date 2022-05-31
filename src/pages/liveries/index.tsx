import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import {
  chakra,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Grid,
  GridItem,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Button,
  Flex,
  NumberInputField,
  NumberInput
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { SearchIcon } from '@chakra-ui/icons';
import { FormattedMessage, useIntl } from 'react-intl';

import { apiSlice, wrapper } from '../../store/store';
import { getLiveries, useGetLiveriesQuery } from '../../store/livery/api-slice';
import { getCars, useGetCarsQuery } from '../../store/car/api-slice';

import { LiveryList } from '../../components/features';
import { MainLayout } from '../../components/layout';
import { PageHeading } from '../../components/shared';

import { LIVERIES_URL, LIVERY_CREATE_URL } from '../../utils/nav';
import { liveryStrings, commonStrings } from '../../utils/intl';
import Link from 'next/link';
import { LiveriesFilterKeys, Order } from '../../types';

const initialState = {
  search: '',
  car: '',
  priceMin: '00.00',
  priceMax: '00.00',
  created: Order.ASC,
  rating: '0',
  page: 0
};

type Action = { type: LiveriesFilterKeys; payload: any };
const filtersReducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case LiveriesFilterKeys.SEARCH: {
      return { ...state, search: action.payload };
    }
    case LiveriesFilterKeys.CAR: {
      return { ...state, car: action.payload };
    }
    case LiveriesFilterKeys.PRICE_MIN: {
      return { ...state, priceMin: action.payload };
    }
    case LiveriesFilterKeys.PRICE_MAX: {
      return { ...state, priceMax: action.payload };
    }
    case LiveriesFilterKeys.CREATED: {
      return { ...state, created: action.payload };
    }
    case LiveriesFilterKeys.RATING: {
      return { ...state, rating: action.payload };
    }
    case LiveriesFilterKeys.PAGE: {
      return { ...state, page: action.payload };
    }
    default:
      return state;
  }
};

const Liveries: NextPage = () => {
  // STATE
  const [filters, dispatch] = useReducer(filtersReducer, initialState);
  const [maxPriceCap, setMaxPriceCap] = useState<number>(0);

  // HOOKS
  const intl = useIntl();

  // QUERIES
  const { data: cars } = useGetCarsQuery();
  const { data: liveries } = useGetLiveriesQuery(filters);

  // EFFECTS
  useEffect(() => {
    if (liveries?.maxPrice && liveries.maxPrice / 100 > maxPriceCap) {
      const value = (liveries?.maxPrice || 0) / 100;
      setMaxPriceCap(value);
    }
  }, [liveries?.maxPrice, maxPriceCap]);

  // HANDLERS
  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: LiveriesFilterKeys.SEARCH, payload: event.target.value });
  };

  const onCarChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: LiveriesFilterKeys.CAR, payload: event.target.value });
  };
  const onMinPriceChange = (value: string) => {
    dispatch({ type: LiveriesFilterKeys.PRICE_MIN, payload: value });
  };
  const onMaxPriceChange = (value: string) => {
    dispatch({ type: LiveriesFilterKeys.PRICE_MAX, payload: value });
  };
  const onPriceRangeChange = (value: [number, number]) => {
    dispatch({
      type: LiveriesFilterKeys.PRICE_MIN,
      payload: value[0].toLocaleString('en-GB', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    });
    dispatch({
      type: LiveriesFilterKeys.PRICE_MAX,
      payload: value[1].toLocaleString('en-GB', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    });
  };
  const onCreatedChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (value !== Order.ASC && value !== Order.DESC) return;
    dispatch({ type: LiveriesFilterKeys.CREATED, payload: value });
  };
  const onRatingChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: LiveriesFilterKeys.RATING, payload: event.target.value });
  };
  const onPageChange = (page: number) => () => {
    dispatch({ type: LiveriesFilterKeys.PAGE, payload: page });
  };

  const pages = Array.from(
    Array(Math.ceil((liveries?.total || 1) / (liveries?.perPage || 1))).keys()
  );

  return (
    <MainLayout
      pageTitle="Liveries"
      pageDescription="Find your next livery from the collection uploaded by our users!"
      urlPath={LIVERIES_URL}
    >
      <PageHeading
        heading={<FormattedMessage {...liveryStrings.liveriesHeading} />}
        paragraph={<FormattedMessage {...liveryStrings.liveriesSummary} />}
      />
      <Flex w="full" maxW="5xl" my={5}>
        <Button colorScheme="red" w="3xs" lineHeight={1}>
          <Link href={LIVERY_CREATE_URL}>
            <a>
              <FormattedMessage {...liveryStrings.uploadALivery} />
            </a>
          </Link>
        </Button>
      </Flex>
      <chakra.section pt={8} w="5xl" display="flex" justifyContent="flex-start">
        <Grid
          templateColumns="repeat(6, 1fr)"
          templateRows="repeat(3, 1fr)"
          gap={4}
          w="2xl"
        >
          <GridItem colSpan={3} rowSpan={1}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                color="gray.300"
                fontSize="1.2em"
              >
                <SearchIcon />
              </InputLeftElement>
              <Input
                placeholder={intl.formatMessage(
                  commonStrings.searchPlaceholder
                )}
                onChange={onSearchChange}
                value={filters.search}
              />
            </InputGroup>
          </GridItem>
          <GridItem colSpan={3} rowSpan={1}>
            <Select
              placeholder={intl.formatMessage(
                commonStrings.selectCarPlaceholder
              )}
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
          <GridItem colSpan={1} rowSpan={1}>
            <InputGroup>
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
            <InputGroup>
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
          <GridItem colSpan={2} rowSpan={1}>
            <Select
              placeholder={intl.formatMessage(
                commonStrings.createdAtPlaceholder
              )}
              value={filters.created}
              onChange={onCreatedChange}
            >
              <option value={Order.ASC}>Most recent first</option>
              <option value={Order.DESC}>Oldest first</option>
            </Select>
          </GridItem>
          <GridItem colSpan={2} rowSpan={1}>
            <Select
              placeholder={intl.formatMessage(commonStrings.ratingPlaceholder)}
              value={filters.rating}
              onChange={onRatingChange}
            >
              <option value={5}>5 Star </option>
              <option value={4}>4 Star +</option>
              <option value={3}>3 Star +</option>
              <option value={2}>2 Star +</option>
              <option value={1}>1 Star +</option>
            </Select>
          </GridItem>
        </Grid>
      </chakra.section>
      <LiveryList liveries={liveries} />
      <Flex w="5xl" justifyContent="flex-end">
        <Flex mt={4}>
          {pages.map((page) => {
            return (
              <Button
                mx={1}
                border="1px solid #c4c4c4"
                key={page + 1}
                colorScheme={(liveries?.page || 0) === page ? 'red' : undefined}
                lineHeight={1}
                onClick={onPageChange(page)}
              >
                {page + 1}
              </Button>
            );
          })}
        </Flex>
      </Flex>
    </MainLayout>
  );
};

export default Liveries;

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  store.dispatch(getCars.initiate());
  store.dispatch(getLiveries.initiate({}));
  await Promise.all(apiSlice.util.getRunningOperationPromises());
  return {
    props: {}
  };
});
