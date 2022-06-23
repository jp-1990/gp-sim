import React from 'react';
import { NextPage } from 'next';
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

import { MainLayout } from '../../components/layout';
import { Breadcrumbs } from '../../components/core';

import { wrapper } from '../../store/store';
import { commonStrings, garageStrings } from '../../utils/intl';
import { GARAGE_CREATE_URL } from '../../utils/nav';
import { breadcrumbOptions } from '../../components/features/garages/CreateGarage/config';

import { Form } from '../../components/shared';
import Title from '../../components/features/garages/CreateGarage/components/Title/Title';
import Description from '../../components/features/garages/CreateGarage/components/Description/Description';
import SelectGarageImage from '../../components/features/garages/CreateGarage/components/SelectGarageImage/SelectGarageImage';
import SubmitGarage from '../../components/features/garages/CreateGarage/components/SubmitGarage/SubmitGarage';

const Create: NextPage = () => {
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
        <Form>
          <Grid
            templateColumns="repeat(12, 1fr)"
            templateRows="repeat(11)"
            gap={4}
            w="5xl"
            my={8}
          >
            <GridItem rowSpan={1} colSpan={12}>
              <Title />
            </GridItem>
            <GridItem rowSpan={1} colSpan={12}>
              <Description />
            </GridItem>
            <GridItem rowSpan={1} colSpan={12} mt={5} mb={3}>
              <SelectGarageImage />
              <Divider mt={3} />
            </GridItem>
            <GridItem rowSpan={1} colSpan={3}>
              <SubmitGarage />
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

export const getStaticProps = wrapper.getStaticProps(() => async () => {
  return {
    props: {}
  };
});
