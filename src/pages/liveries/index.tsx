/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
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
  RangeSliderThumb
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { SearchIcon } from '@chakra-ui/icons';
import { FormattedMessage } from 'react-intl';

import store, { useAppDispatch } from '../../store/store';
import {
  getLiveriesThunk,
  rehydrateLiverySlice,
  LIVERY_SLICE_NAME,
  LiverySliceStateType
} from '../../store/livery/slice';
import {
  getCarsThunk,
  rehydrateCarSlice,
  CAR_SLICE_NAME,
  CarSliceStateType
} from '../../store/car/slice';

import { LiveryCard } from '../../components/features';
import { MainLayout } from '../../components/layout';
import { PageHeading } from '../../components/shared';

import { LIVERIES_URL } from '../../utils/nav';
import { liveryStrings } from '../../utils/intl';

interface Props {
  car: CarSliceStateType;
  livery: LiverySliceStateType;
}
const Liveries: NextPage<Props> = ({ car, livery }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(rehydrateLiverySlice(livery));
    dispatch(rehydrateCarSlice(car));
  }, []);

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
              <Input placeholder="Search..." />
            </InputGroup>
          </GridItem>
          <GridItem colSpan={3} rowSpan={1}>
            <Select placeholder="Select car">
              {car.ids.map((id) => {
                const target = car.entities[id];
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
              <Input placeholder="min" />
            </InputGroup>
          </GridItem>
          <GridItem colSpan={1} rowSpan={1}>
            <InputGroup>
              <Input placeholder="max" />
            </InputGroup>
          </GridItem>
          <GridItem colSpan={4} rowSpan={1} display="flex">
            <RangeSlider
              // eslint-disable-next-line jsx-a11y/aria-proptypes
              aria-label={['min', 'max']}
              colorScheme="pink"
              defaultValue={[10, 30]}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
          </GridItem>
          <GridItem colSpan={2} rowSpan={1}>
            <Select placeholder="Created">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </GridItem>
          <GridItem colSpan={2} rowSpan={1}>
            <Select placeholder="Rating">
              <option value="option1">5 Star </option>
              <option value="option2">4 Star +</option>
              <option value="option3">3 Star +</option>
              <option value="option2">2 Star +</option>
              <option value="option3">1 Star +</option>
            </Select>
          </GridItem>
        </Grid>
      </chakra.section>
      <chakra.section pt={9}>
        <Grid
          templateColumns="repeat(3, 1fr)"
          templateRows="repeat(3, 1fr)"
          gap={4}
          w="5xl"
        >
          {livery.ids.map((e) => {
            const target = livery.entities[e.valueOf()];
            if (!target) return null;
            const { id, creator, rating, title, car, images, price } = target;
            return (
              <LiveryCard
                key={e}
                car={car}
                creator={creator}
                rating={rating}
                id={id}
                image={images[0]}
                price={price}
                title={title}
              />
            );
          })}
        </Grid>
      </chakra.section>
    </MainLayout>
  );
};

export default Liveries;

export const getStaticProps = async () => {
  await Promise.all([
    store.dispatch(getLiveriesThunk({ filters: {}, quantity: 100 })),
    store.dispatch(getCarsThunk())
  ]);

  const car = store.getState()[CAR_SLICE_NAME];
  const livery = store.getState()[LIVERY_SLICE_NAME];
  return {
    props: { livery, car }
  };
};
