import { Grid, GridItem, Divider, Button } from '@chakra-ui/react';
import React from 'react';

import { FormattedMessage } from 'react-intl';
import { commonStrings } from '../../../../utils/intl';
import { Form } from '../../../shared';

import Description from './components/Description/Description';
import SelectGarageImage from './components/SelectGarageImage/SelectGarageImage';
import SubmitGarage from './components/SubmitGarage/SubmitGarage';
import Title from './components/Title/Title';

const CreateGarage = () => {
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
  );
};

export default CreateGarage;
