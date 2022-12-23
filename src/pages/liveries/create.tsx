import React from 'react';
import { NextPage } from 'next';
import { FormattedMessage } from 'react-intl';
import { Box, chakra, Flex, Heading, Text } from '@chakra-ui/react';

import { MainLayout } from '../../components/layout';
import CreateLivery from '../../components/features/liveries/CreateLivery/CreateLivery';
import { Unauthorized } from '../../components/shared';

import { wrapper } from '../../store/store';
import { liveryStrings } from '../../utils/intl';
import { LIVERY_CREATE_URL } from '../../utils/nav';
import { useAuthCheck } from '../../hooks/use-auth-check';
import { actions as carActions } from '../../store/car/slice';
import db, { CacheKeys } from '../../lib';

const Create: NextPage = () => {
  // AUTH CHECK
  const { currentUser } = useAuthCheck();

  if (!currentUser.token) return <Unauthorized />;
  return (
    <MainLayout
      pageTitle="Create Livery"
      pageDescription="Create and upload your own livery!"
      urlPath={LIVERY_CREATE_URL}
    >
      <Box maxW="5xl" w="5xl" display="flex" flexDir={'column'}>
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

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  let cars = await db.cache.get(CacheKeys.CAR);

  if (!cars) {
    cars = await db.getCars();
  }

  if (cars) store.dispatch(carActions.setCars(cars));

  return {
    props: {}
  };
});
