import React from 'react';
import { NextPage } from 'next';
import { FormattedMessage } from 'react-intl';
import { Box, chakra, Flex, Heading, Text } from '@chakra-ui/react';

import { MainLayout } from '../../components/layout';
import { Breadcrumbs } from '../../components/core';

import { wrapper } from '../../store/store';
import { garageStrings } from '../../utils/intl';
import { GARAGE_CREATE_URL } from '../../utils/nav';
import { breadcrumbOptions } from '../../components/features/garages/CreateGarage/config';

import CreateGarage from '../../components/features/garages/CreateGarage/CreateGarage';
import { useAuthCheck } from '../../hooks/use-auth-check';
import { Unauthorized } from '../../components/shared';

const Create: NextPage = () => {
  // AUTH CHECK
  const { currentUser } = useAuthCheck();

  if (!currentUser.token) return <Unauthorized />;
  return (
    <MainLayout
      pageTitle="Create Garage"
      pageDescription="Create a garage to store a collection of liveries!"
      urlPath={GARAGE_CREATE_URL}
    >
      <Box maxW="5xl" w="5xl" display="flex" flexDir={'column'}>
        <Breadcrumbs options={breadcrumbOptions} />
        <chakra.section pt={8}>
          <Flex direction="column" maxW="5xl">
            <Heading size="xl" pb={4}>
              <FormattedMessage {...garageStrings.createHeading} />
            </Heading>
            <Text fontSize="md">
              <FormattedMessage {...garageStrings.createSummary} />
            </Text>
          </Flex>
        </chakra.section>
        <CreateGarage />
      </Box>
    </MainLayout>
  );
};

export default Create;

export const getStaticProps = wrapper.getStaticProps(() => async () => {
  return {
    props: {}
  };
});
