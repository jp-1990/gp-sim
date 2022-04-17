import React, { useState } from 'react';
import { NextPage } from 'next';
import { FormattedMessage, useIntl } from 'react-intl';

import { MainLayout } from '../../components/layout';
import { Breadcrumbs, ImageWithFallback } from '../../components/core';
import {
  Checkbox,
  Form,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SelectImages,
  SubmitButton,
  Textarea
} from '../../components/shared';

import { commonStrings, liveryStrings, formStrings } from '../../utils/intl';
import { LIVERIES_URL, LIVERY_UPLOAD_URL } from '../../utils/nav';
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

const breadcrumbOptions = [
  {
    name: <FormattedMessage {...commonStrings.paintshop} />,
    href: LIVERIES_URL
  },
  {
    name: <FormattedMessage {...liveryStrings.uploadALivery} />,
    href: undefined
  }
];

const Create: NextPage = () => {
  const intl = useIntl();
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
              <Input
                stateKey="title"
                label={<FormattedMessage {...formStrings.title} />}
                placeholder={intl.formatMessage({
                  ...formStrings.titlePlaceholder
                })}
                w="sm"
                validators={['NON_NULL_STRING']}
                isRequired
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={12}>
              <Select
                stateKey="car"
                label={<FormattedMessage {...formStrings.car} />}
                placeholder={intl.formatMessage({
                  ...formStrings.carPlaceholder
                })}
                w="sm"
                isRequired
                validators={['NON_NULL_STRING']}
              >
                <option value="option1">Option 1</option>
              </Select>
            </GridItem>
            <GridItem rowSpan={1} colSpan={12}>
              <Textarea
                stateKey="description"
                label={<FormattedMessage {...formStrings.description} />}
                w="3xl"
                placeholder={intl.formatMessage({
                  ...liveryStrings.descriptionPlaceholder
                })}
                size="md"
                resize="none"
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={12} mt={3} mb={1}>
              <Button
                size="sm"
                px={12}
                lineHeight={1}
                colorScheme="red"
                fontWeight="normal"
              >
                {<FormattedMessage {...formStrings.selectLiveryFiles} />}
              </Button>
              <Divider mt={2} />
            </GridItem>
            <GridItem rowSpan={1} colSpan={12}>
              <Checkbox
                stateKey="publicLivery"
                defaultIsChecked
                colorScheme="red"
              >
                {<FormattedMessage {...formStrings.makeThisLiveryPublic} />}
              </Checkbox>
              <Checkbox stateKey="privateGarage" colorScheme="red">
                {
                  <FormattedMessage
                    {...formStrings.addThisLiveryToAPrivateGarage}
                  />
                }
              </Checkbox>
            </GridItem>
            <GridItem rowSpan={1} colSpan={3}>
              <Select
                stateKey="garage"
                label={<FormattedMessage {...formStrings.garage} />}
                size={'md'}
                placeholder={intl.formatMessage({
                  ...formStrings.garagePlaceholder
                })}
              >
                <option value="option1">Option 1</option>
              </Select>
            </GridItem>
            <GridItem rowSpan={1} colSpan={4}>
              <Input
                stateKey="garageKey"
                label={<FormattedMessage {...formStrings.garageKey} />}
                placeholder={intl.formatMessage({
                  ...formStrings.garageKey
                })}
              />
            </GridItem>

            <GridItem rowSpan={1} colSpan={12}>
              <NumberInput
                stateKey="price"
                label={<FormattedMessage {...formStrings.price} />}
                precision={2}
                defaultValue={intl.formatMessage({
                  ...formStrings.pricePlaceholder
                })}
                w={48}
                step={0.01}
                min={0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </GridItem>
            <GridItem rowSpan={1} colSpan={12}>
              <Input
                stateKey="tags"
                label={<FormattedMessage {...formStrings.searchTags} />}
                placeholder={intl.formatMessage({
                  ...formStrings.searchTagsPlaceholder
                })}
                w={48}
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={12} mt={5} mb={3}>
              <SelectImages<'images'> max={4} stateKey="images">
                {(state, onRemove) => {
                  if (!state) return null;
                  const { images } = { ...state };
                  return (
                    <Grid
                      templateColumns="repeat(4, 1fr)"
                      templateRows="repeat(1, minmax(8rem, auto))"
                      gap={3}
                      pt={3}
                      w="3xl"
                    >
                      {images.map((image, i) => (
                        <GridItem
                          key={i}
                          colSpan={1}
                          rowSpan={1}
                          display="flex"
                          flexDir="column"
                          borderRadius={4}
                          overflow="hidden"
                          position="relative"
                          border="1px solid"
                          borderColor="gray.200"
                        >
                          <ImageWithFallback
                            h="full"
                            w="full"
                            imgUrl={URL.createObjectURL(image)}
                          />
                          <Button
                            size="sm"
                            borderRadius={0}
                            onClick={() => onRemove(i)}
                            colorScheme="blackAlpha"
                            fontWeight="normal"
                          >
                            {<FormattedMessage {...commonStrings.remove} />}
                          </Button>
                        </GridItem>
                      ))}
                    </Grid>
                  );
                }}
              </SelectImages>
              <Divider mt={3} />
            </GridItem>
            <GridItem rowSpan={1} colSpan={3}>
              <SubmitButton
                onClick={() => null}
                colorScheme="red"
                w="2xs"
                lineHeight={1}
              >
                {<FormattedMessage {...liveryStrings.uploadLivery} />}
              </SubmitButton>
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
