import { ChangeEvent, useState } from 'react';
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
import { FormattedMessage } from 'react-intl';

import { apiSlice, wrapper } from '../../store/store';
import { getLiveries, useGetLiveriesQuery } from '../../store/livery/slice';
import { getCars, useGetCarsQuery } from '../../store/car/slice';

import { LiveryList } from '../../components/features';
import { MainLayout } from '../../components/layout';
import { PageHeading } from '../../components/shared';

import { LIVERIES_URL, LIVERY_CREATE_URL } from '../../utils/nav';
import { liveryStrings } from '../../utils/intl';
import Link from 'next/link';
import { Order } from '../../types';

const Liveries: NextPage = () => {
  // QUERIES
  const { data: cars } = useGetCarsQuery();
  const { data: liveries } = useGetLiveriesQuery();

  // STATE
  const maxPriceCap = (liveries?.maxPrice || 0) / 100;
  const [search, setSearch] = useState<string>('');
  const [car, setCar] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('00.00');
  const [maxPrice, setMaxPrice] = useState<string>(`${maxPriceCap}`);
  const [created, setCreated] = useState<Order>(Order.ASC);
  const [rating, setRating] = useState<number>(0);

  // HANDLERS
  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  const onCarChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCar(event.target.value);
  };
  const onMinPriceChange = (value: string) => {
    setMinPrice(value);
  };
  const onMaxPriceChange = (value: string) => {
    setMaxPrice(value);
  };
  const onPriceRangeChange = (value: [number, number]) => {
    setMinPrice(
      value[0].toLocaleString('en-GB', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );
    setMaxPrice(`${value[1]}`);
  };
  const onCreatedChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (value !== Order.ASC && value !== Order.DESC) return;
    setCreated(value);
  };
  const onRatingChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setRating(+event.target.value);

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
                placeholder="Search..."
                onChange={onSearchChange}
                value={search}
              />
            </InputGroup>
          </GridItem>
          <GridItem colSpan={3} rowSpan={1}>
            <Select placeholder="Select car" onChange={onCarChange} value={car}>
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
                value={minPrice}
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
                value={maxPrice}
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
              defaultValue={[+minPrice, maxPriceCap]}
              min={0}
              max={maxPriceCap}
              step={0.01}
              value={[+minPrice, +maxPrice]}
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
              placeholder="Created"
              value={created}
              onChange={onCreatedChange}
            >
              <option value={Order.ASC}>Most recent first</option>
              <option value={Order.DESC}>Oldest first</option>
            </Select>
          </GridItem>
          <GridItem colSpan={2} rowSpan={1}>
            <Select
              placeholder="Rating"
              value={rating}
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
    </MainLayout>
  );
};

export default Liveries;

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  store.dispatch(getCars.initiate());
  store.dispatch(getLiveries.initiate());
  await Promise.all(apiSlice.util.getRunningOperationPromises());
  return {
    props: {}
  };
});
