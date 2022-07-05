import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import { Form } from '../../../shared';
import DisplayName from './components/DisplayName/DisplayName';
import Email from './components/Email/Email';
import Forename from './components/Forename/Forename';
import Surname from './components/Surname/Surname';
import SelectProfileImage from './components/SelectProfileImage/SelectProfileImage';
import SubmitProfile from './components/SubmitProfile/SubmitProfile';
import About from './components/About/About';

const UpdateProfile = () => {
  return (
    <Form>
      <Grid
        templateColumns={`repeat(6, 1fr)`}
        gap={4}
        maxW="5xl"
        minW="5xl"
        mt={4}
      >
        <GridItem colSpan={3}>
          <Forename />
        </GridItem>
        <GridItem colSpan={3} rowSpan={3} mt={6}>
          <SelectProfileImage />
        </GridItem>
        <GridItem colSpan={3}>
          <Surname />
        </GridItem>
        <GridItem colSpan={3}>
          <Email />
        </GridItem>
        <GridItem colSpan={4}>
          <DisplayName />
        </GridItem>
        <GridItem colSpan={4}>
          <About />
        </GridItem>
        <GridItem colSpan={4} mt={20}>
          <SubmitProfile />
        </GridItem>
      </Grid>
    </Form>
  );
};

export default UpdateProfile;
