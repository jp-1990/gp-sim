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

import store, { useAppDispatch } from '../../store/store';
import { fetchLiveries, rehydrate } from '../../store/livery/slice';
import { LiveryCard } from '../../components/features';
import { MainLayout } from '../../components/layout';
import { PageHeading } from '../../components/shared';

import { LiveryDataType } from '../../types';

interface Props {
  liveries: Record<string, LiveryDataType>;
  ids: string[];
}
const Liveries: NextPage<Props> = ({ liveries, ids }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(rehydrate({ liveries, ids }));
  }, []);

  return (
    <MainLayout
      pageTitle="Liveries"
      pageDescription="Find your next livery from the collection uploaded by our users!"
      urlPath="/liveries"
    >
      <PageHeading
        heading="<section heading>"
        paragraph={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            mauris eros, euismod ut mi vitae, convallis iaculis quam.
            Pellentesque consectetur iaculis tortor vitae euismod. Integer
            malesuada congue elementum. Pellentesque vulputate diam dignissim
            elit hendrerit iaculis.
            Interdum et malesuada fames ac ante ipsum primis in faucibus
            `}
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
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
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
          {ids.map((e: string) => {
            const {
              id,
              author,
              rating,
              downloads,
              title,
              car,
              imgUrls,
              price
            } = liveries[e];
            return (
              <LiveryCard
                key={e}
                author={author}
                rating={rating}
                downloads={downloads}
                id={id}
                title={title}
                car={car}
                imgUrl={imgUrls[0]}
                price={price}
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
  await store.dispatch(fetchLiveries({ filters: {}, quantity: 100 }));
  const { liveries, ids } = store.getState().livery;
  return {
    props: { liveries, ids }
  };
};
