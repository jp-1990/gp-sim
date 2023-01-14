import React, { useEffect } from 'react';
import { Button, Divider, Grid, GridItem } from '@chakra-ui/react';
import { FormattedMessage } from 'react-intl';
import { useRouter } from 'next/router';

import { commonStrings } from '../../../../utils/intl';
import { Form, useForm } from '../../../shared';
import { LiveryDataType } from '../../../../types';

import Description from './components/Description/Description';
import PublicLivery from './components/PublicLivery/PublicLivery';
import SearchTags from './components/SearchTags/SearchTags';
import SelectLiveryImages from './components/SelectLiveryImages/SelectLiveryImages';
import SubmitLivery from './components/SubmitLivery/SubmitLivery';
import Title from './components/Title/Title';

import { UpdateLiveryFormStateType } from './types';
import { stateKeys } from './config';

type Props = {
  livery: LiveryDataType;
};

const WrapedUpdateLivery = ({ livery }: Props) => {
  const { setState } = useForm<UpdateLiveryFormStateType>();
  const router = useRouter();

  useEffect(() => {
    if (livery) {
      setState((prev) => {
        return {
          ...prev,
          [stateKeys.TITLE]: livery.title,
          [stateKeys.DESCRIPTION]: livery.description,
          [stateKeys.PUBLIC_LIVERY]: livery.isPublic,
          [stateKeys.SEARCH_TAGS]: livery.tags,
          [stateKeys.IMAGE_FILES]: livery.images
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livery]);

  return (
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
      <GridItem rowSpan={1} colSpan={12}>
        <PublicLivery />
      </GridItem>
      {/* <GridItem rowSpan={1} colSpan={12}>
          <Price />
        </GridItem> */}
      <GridItem rowSpan={1} colSpan={12}>
        <SearchTags />
      </GridItem>
      <GridItem rowSpan={1} colSpan={12} mt={5} mb={3}>
        <SelectLiveryImages />
        <Divider mt={3} />
      </GridItem>
      <GridItem rowSpan={1} colSpan={3}>
        <SubmitLivery livery={livery} />
      </GridItem>
      <GridItem rowSpan={1} colSpan={3}>
        <Button
          mx={2}
          colorScheme="red"
          variant="outline"
          w="3xs"
          lineHeight={1}
          onClick={() => router.back()}
        >
          {<FormattedMessage {...commonStrings.cancel} />}
        </Button>
      </GridItem>
    </Grid>
  );
};

const UpdateLivery = ({ livery }: Props) => {
  return (
    <Form>
      <WrapedUpdateLivery livery={livery} />
    </Form>
  );
};
export default UpdateLivery;
