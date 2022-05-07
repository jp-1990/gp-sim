import React from 'react';
import { Button, Divider, Grid, GridItem } from '@chakra-ui/react';
import { FormattedMessage } from 'react-intl';

import { commonStrings } from '../../../../utils/intl';
import { Form } from '../../../shared';

import Description from './components/Description/Description';
import GarageKey from './components/GarageKey/GarageKey';
import Price from './components/Price/Price';
import PrivateLivery from './components/PrivateLivery/PrivateLivery';
import PublicLivery from './components/PublicLivery/PublicLivery';
import SearchTags from './components/SearchTags/SearchTags';
import SelectCar from './components/SelectCar/SelectCar';
import SelectGarage from './components/SelectGarage/SelectGarage';
import SelectLiveryFiles from './components/SelectLiveryFiles/SelectLiveryFiles';
import SelectLiveryImages from './components/SelectLiveryImages/SelectLiveryImages';
import SubmitLivery from './components/SubmitLivery/SubmitLivery';
import Title from './components/Title/Title';

const CreateLivery: React.FC = () => {
  return (
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
          <SelectCar />
        </GridItem>
        <GridItem rowSpan={1} colSpan={12}>
          <Description />
        </GridItem>
        <GridItem rowSpan={1} colSpan={12} my={5}>
          <SelectLiveryFiles />
        </GridItem>
        <GridItem rowSpan={1} colSpan={12}>
          <PublicLivery />
          <PrivateLivery />
        </GridItem>
        <GridItem rowSpan={1} colSpan={3}>
          <SelectGarage />
        </GridItem>
        <GridItem rowSpan={1} colSpan={4}>
          <GarageKey />
        </GridItem>
        <GridItem rowSpan={1} colSpan={12}>
          <Price />
        </GridItem>
        <GridItem rowSpan={1} colSpan={12}>
          <SearchTags />
        </GridItem>
        <GridItem rowSpan={1} colSpan={12} mt={5} mb={3}>
          <SelectLiveryImages />
          <Divider mt={3} />
        </GridItem>
        <GridItem rowSpan={1} colSpan={3}>
          <SubmitLivery />
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
  );
};

export default CreateLivery;
