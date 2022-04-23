/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { FormattedMessage } from 'react-intl';
import { Box, chakra, Flex, Heading, Text } from '@chakra-ui/react';

import { MainLayout } from '../../components/layout';
import { Breadcrumbs } from '../../components/core';
import CreateLivery from '../../components/features/liveries/CreateLivery/CreateLivery';

import store, { useAppDispatch } from '../../store/store';
import { CarState, fetchCars, rehydrateCarSlice } from '../../store/car/slice';
import { liveryStrings } from '../../utils/intl';
import { LIVERY_UPLOAD_URL } from '../../utils/nav';
import { breadcrumbOptions } from '../../components/features/liveries/CreateLivery/config';

interface Props {
  car: CarState;
}
const Create: NextPage<Props> = ({ car }) => {
  const dispatch = useAppDispatch();

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
        <CreateLivery />
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
