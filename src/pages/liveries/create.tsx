/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useDispatch } from 'react-redux';

import { MainLayout } from '../../components/layout';
import { Breadcrumbs, ImageWithFallback, Tag } from '../../components/core';
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
  SelectFiles,
  SubmitButton,
  Tags,
  Textarea
} from '../../components/shared';
import {
  validatorOptions,
  liveryFileNames
} from '../../components/shared/Form/utils';

import store from '../../store/store';
import { CarState, fetchCars, rehydrateCarSlice } from '../../store/car/slice';
import { commonStrings, liveryStrings, formStrings } from '../../utils/intl';
import { LIVERIES_URL, LIVERY_UPLOAD_URL } from '../../utils/nav';

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

const stateKeys = {
  TITLE: 'title',
  CAR: 'car',
  DESCRIPTION: 'description',
  LIVERY_FILES: 'liveryFiles',
  PUBLIC_LIVERY: 'publicLivery',
  PRIVATE_GARAGE: 'privateGarage',
  GARAGE: 'garage',
  GARAGE_KEY: 'garageKey',
  PRICE: 'price',
  SEARCH_TAGS: 'searchTags',
  IMAGE_FILES: 'imageFiles'
} as const;

const validators = {
  title: [validatorOptions.NON_NULL_STRING],
  car: [validatorOptions.NON_NULL_STRING],
  description: undefined,
  liveryFiles: undefined,
  publicLivery: undefined,
  privateGarage: undefined,
  garage: undefined,
  garageKey: undefined,
  price: undefined,
  searchTags: undefined,
  imageFiles: undefined
};

interface Props {
  car: CarState;
}
const Create: NextPage<Props> = ({ car }) => {
  const intl = useIntl();
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
              <Input
                isRequired
                validators={validators.title}
                stateKey={stateKeys.TITLE}
                label={<FormattedMessage {...formStrings.title} />}
                placeholder={intl.formatMessage({
                  ...formStrings.titlePlaceholder
                })}
                w="sm"
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={12}>
              <Select
                isRequired
                validators={validators.car}
                stateKey={stateKeys.CAR}
                label={<FormattedMessage {...formStrings.car} />}
                placeholder={intl.formatMessage({
                  ...formStrings.carPlaceholder
                })}
                w="sm"
              >
                {car.ids.map((id) => {
                  const targetCar = car.cars[id];
                  return (
                    <option key={id + targetCar.name} value={targetCar.name}>
                      {targetCar.name}
                    </option>
                  );
                })}
              </Select>
            </GridItem>
            <GridItem rowSpan={1} colSpan={12}>
              <Textarea
                validators={validators.description}
                stateKey={stateKeys.DESCRIPTION}
                label={<FormattedMessage {...formStrings.description} />}
                w="3xl"
                placeholder={intl.formatMessage({
                  ...liveryStrings.descriptionPlaceholder
                })}
                size="md"
                resize="none"
              />
            </GridItem>

            <GridItem rowSpan={1} colSpan={12} my={5}>
              <SelectFiles<typeof stateKeys.LIVERY_FILES>
                validators={validators.imageFiles}
                stateKey={stateKeys.LIVERY_FILES}
                label={<FormattedMessage {...formStrings.selectLiveryFiles} />}
                accept=".json,.dds,.png"
                helperText={
                  <FormattedMessage
                    {...formStrings.selectLiveryFilesHelperText}
                  />
                }
              >
                {(state, onRemove) => {
                  if (!state) return null;
                  const { [stateKeys.LIVERY_FILES]: files } = { ...state };

                  const isApproved = (s: string | undefined) =>
                    s ? (
                      <CheckIcon w={3} h={3} color="green" />
                    ) : (
                      <CloseIcon w={3} h={2} color="red" />
                    );
                  const getId = (files: File[], name: string) =>
                    files.findIndex((f) => f.name === name);

                  const dynamicRows = () => {
                    const selectedFile = files.find((f) => {
                      const name = f.name as typeof liveryFileNames[number];
                      return !liveryFileNames.includes(name);
                    });

                    const approved = isApproved(
                      selectedFile?.name.match(
                        /^[a-zA-Z0-9]+([-_\s]{1}[a-zA-Z0-9]+)(\.json)/g
                      )
                        ? selectedFile?.name
                        : undefined
                    );
                    return (
                      <GridItem colSpan={12} rowSpan={1}>
                        <Grid
                          templateColumns="repeat(12, 1fr)"
                          templateRows="repeat(1,minmax(2rem, 2rem))"
                        >
                          <GridItem fontSize={'sm'} rowSpan={1} colSpan={4}>
                            [your-livery-name].json
                          </GridItem>
                          <GridItem fontSize={'sm'} rowSpan={1} colSpan={6}>
                            {selectedFile?.name || '-'}
                          </GridItem>
                          <GridItem fontSize={'sm'} rowSpan={1} colSpan={1}>
                            {approved}
                          </GridItem>
                          <GridItem fontSize={'sm'} rowSpan={1} colSpan={1}>
                            {selectedFile?.name && (
                              <Button
                                h={4}
                                variant="ghost"
                                lineHeight={1}
                                fontSize={'xs'}
                                colorScheme="red"
                                onClick={() =>
                                  onRemove(getId(files, selectedFile.name))
                                }
                              >
                                Remove
                              </Button>
                            )}
                          </GridItem>
                        </Grid>
                      </GridItem>
                    );
                  };

                  const fixedRows = () =>
                    liveryFileNames.map((name, i) => {
                      const selectedFile = files.find((f) => f.name === name);
                      const approved = isApproved(selectedFile?.name);

                      return (
                        <GridItem key={name + i} colSpan={12} rowSpan={1}>
                          <Grid
                            templateColumns="repeat(12, 1fr)"
                            templateRows="repeat(1,minmax(2rem, 2rem))"
                          >
                            <GridItem fontSize={'sm'} rowSpan={1} colSpan={4}>
                              {name}
                            </GridItem>
                            <GridItem fontSize={'sm'} rowSpan={1} colSpan={6}>
                              {selectedFile?.name || '-'}
                            </GridItem>
                            <GridItem fontSize={'sm'} rowSpan={1} colSpan={1}>
                              {approved}
                            </GridItem>
                            <GridItem rowSpan={1} colSpan={1}>
                              {selectedFile?.name && (
                                <Button
                                  h={4}
                                  variant="ghost"
                                  lineHeight={1}
                                  fontSize={'xs'}
                                  colorScheme="red"
                                  onClick={() =>
                                    onRemove(getId(files, selectedFile.name))
                                  }
                                >
                                  Remove
                                </Button>
                              )}
                            </GridItem>
                          </Grid>
                        </GridItem>
                      );
                    });
                  return (
                    <>
                      <Grid
                        templateColumns="repeat(12, 1fr)"
                        templateRows="repeat(6,minmax(2rem, 2rem))"
                        gap={1}
                        w="5xl"
                        my={3}
                        pl={3}
                      >
                        <GridItem
                          fontWeight={'bold'}
                          color="gray.800"
                          rowSpan={1}
                          colSpan={4}
                        >
                          Required Files
                        </GridItem>
                        <GridItem
                          fontWeight={'bold'}
                          color="gray.800"
                          rowSpan={1}
                          colSpan={6}
                        >
                          Currently Selected
                        </GridItem>
                        <GridItem
                          fontWeight={'bold'}
                          color="gray.800"
                          rowSpan={1}
                          colSpan={1}
                        >
                          Approved
                        </GridItem>
                        <GridItem rowSpan={1} colSpan={1}></GridItem>
                        {dynamicRows()}
                        {fixedRows()}
                      </Grid>
                    </>
                  );
                }}
              </SelectFiles>
            </GridItem>
            <GridItem rowSpan={1} colSpan={12}>
              <Checkbox
                validators={validators.publicLivery}
                stateKey={stateKeys.PUBLIC_LIVERY}
                defaultIsChecked
                colorScheme="red"
                my={1}
              >
                {<FormattedMessage {...formStrings.makeThisLiveryPublic} />}
              </Checkbox>
              <Checkbox
                validators={validators.privateGarage}
                stateKey={stateKeys.PRIVATE_GARAGE}
                colorScheme="red"
                my={1}
              >
                {
                  <FormattedMessage
                    {...formStrings.addThisLiveryToAPrivateGarage}
                  />
                }
              </Checkbox>
            </GridItem>
            <GridItem rowSpan={1} colSpan={3}>
              <Select
                validators={validators.garage}
                stateKey={stateKeys.GARAGE}
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
                validators={validators.garageKey}
                stateKey={stateKeys.GARAGE_KEY}
                label={<FormattedMessage {...formStrings.garageKey} />}
                placeholder={intl.formatMessage({
                  ...formStrings.garageKey
                })}
              />
            </GridItem>

            <GridItem rowSpan={1} colSpan={12}>
              <NumberInput
                validators={validators.price}
                stateKey={stateKeys.PRICE}
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
              <Tags<typeof stateKeys.SEARCH_TAGS>
                validators={validators.searchTags}
                stateKey={stateKeys.SEARCH_TAGS}
                label={<FormattedMessage {...formStrings.searchTags} />}
                placeholder={intl.formatMessage({
                  ...formStrings.searchTagsPlaceholder
                })}
                w={48}
              >
                {(state) => {
                  if (!state) return null;
                  const { [stateKeys.SEARCH_TAGS]: tags } = state;
                  const tagsArray = tags.split(',').filter((e) => e.trim());
                  return (
                    <Flex mt={2}>
                      {tagsArray.map((tag, i) => {
                        return <Tag key={tag + i} tag={tag} />;
                      })}
                    </Flex>
                  );
                }}
              </Tags>
            </GridItem>
            <GridItem rowSpan={1} colSpan={12} mt={5} mb={3}>
              <SelectFiles<typeof stateKeys.IMAGE_FILES>
                validators={validators.imageFiles}
                stateKey={stateKeys.IMAGE_FILES}
                label={<FormattedMessage {...commonStrings.selectImages} />}
                max={4}
                accept="image/*"
                helperText={
                  <FormattedMessage {...formStrings.selectImageHelperText} />
                }
              >
                {(state, onRemove) => {
                  if (!state) return null;
                  const { [stateKeys.IMAGE_FILES]: images } = { ...state };
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
              </SelectFiles>
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

export const getStaticProps: GetStaticProps = async () => {
  await store.dispatch(fetchCars());
  const car = store.getState().car;
  return {
    props: {
      car
    }
  };
};
