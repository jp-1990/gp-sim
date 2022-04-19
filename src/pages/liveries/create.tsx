/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { FormattedMessage } from 'react-intl';
import {
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';

import { MainLayout } from '../../components/layout';
import { Breadcrumbs } from '../../components/core';
import { Form } from '../../components/shared';
import {
  breadcrumbOptions,
  LiveryDescription,
  LiveryGarageKey,
  LiveryPrice,
  LiveryPrivate,
  LiveryPublic,
  LiverySearchTags,
  LiverySelectCar,
  LiverySelectFiles,
  LiverySelectGarage,
  LiverySelectImages,
  LiverySubmit,
  LiveryTitle
} from '../../components/features/create-livery';

import store from '../../store/store';
import { CarState, fetchCars, rehydrateCarSlice } from '../../store/car/slice';
import { commonStrings, liveryStrings } from '../../utils/intl';
import { LIVERY_UPLOAD_URL } from '../../utils/nav';

interface Props {
  car: CarState;
}
const Create: NextPage<Props> = ({ car }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rehydrateCarSlice({ cars: car.cars, ids: car.ids }));
  }, []);

  return (
    <MainLayout
      pageTitle="Create Livery"
      pageDescription="Create and upload your own livery!"
      urlPath={LIVERY_UPLOAD_URL}
    >
      <Box maxW="5xl" w="5xl" display="flex" flexDir={'column'}>
        <Breadcrumbs options={breadcrumbOptions} />
        <chakra.section pt={8}>
          <Flex direction="column" maxW="5xl">
            <Heading size="xl" pb={4}>
              <FormattedMessage {...liveryStrings.uploadHeading} />
            </Heading>
            <Text fontSize="md">
              <FormattedMessage {...liveryStrings.uploadSummary} />
            </Text>
          </Flex>
        </chakra.section>
        <Form>
          <Grid
            templateColumns="repeat(12, 1fr)"
            templateRows="repeat(11)"
            gap={4}
            w="5xl"
            my={8}
          >
            <GridItem rowSpan={1} colSpan={12}>
              <LiveryTitle />
            </GridItem>
            <GridItem rowSpan={1} colSpan={12}>
              <LiverySelectCar ids={car.ids} cars={car.cars} />
            </GridItem>
            <GridItem rowSpan={1} colSpan={12}>
              <LiveryDescription />
            </GridItem>
            <GridItem rowSpan={1} colSpan={12} my={5}>
              <LiverySelectFiles />
            </GridItem>
            <GridItem rowSpan={1} colSpan={12}>
              <LiveryPublic />
              <LiveryPrivate />
            </GridItem>
            <GridItem rowSpan={1} colSpan={3}>
              <LiverySelectGarage />
            </GridItem>
            <GridItem rowSpan={1} colSpan={4}>
              <LiveryGarageKey />
            </GridItem>
            <GridItem rowSpan={1} colSpan={12}>
              <LiveryPrice />
            </GridItem>
            <GridItem rowSpan={1} colSpan={12}>
              <LiverySearchTags />
            </GridItem>
            <GridItem rowSpan={1} colSpan={12} mt={5} mb={3}>
              <LiverySelectImages />
              <Divider mt={3} />
            </GridItem>
            <GridItem rowSpan={1} colSpan={3}>
              <LiverySubmit />
            </GridItem>
            <GridItem rowSpan={1} colSpan={3}>
              <Button
                mx={2}
                colorScheme="red"
                variant="outline"
                w="3xs"
                lineHeight={1}
              >
                {<FormattedMessage {...commonStrings.cancel} />}
              </Button>
            </GridItem>
          </Grid>
        </Form>
      </Box>
    </MainLayout>
  );
};

export default Create;

export const getStaticProps: GetStaticProps = async () => {
  await store.dispatch(fetchCars());
  const car = store.getState().car;
  return {
    props: {
      car
    }
  };
};
