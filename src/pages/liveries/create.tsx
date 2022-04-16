import React, { useState } from 'react';
import { NextPage } from 'next';
import { FormattedMessage } from 'react-intl';

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

import { commonStrings, liveryStrings } from '../../utils/intl';
import { LIVERIES_URL, LIVERY_UPLOAD_URL } from '../../utils/nav';
import {
  Box,
  Button,
  chakra,
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
        <chakra.section display="flex" flexDir="column">
          <Form>
            <Input stateKey="title" placeholder="Title" w="sm" />
            <Select stateKey="car" label="car" placeholder="Car" w="sm">
              <option value="option1">Option 1</option>
            </Select>
            <Button w="2xs" lineHeight={1}>
              Select Livery Files
            </Button>
            <Checkbox stateKey="publicLivery">Make this livery public</Checkbox>
            <Checkbox stateKey="privateGarage">
              Add this livery to a private garage
            </Checkbox>
            <Flex>
              <Select stateKey="garage" placeholder="Garage" w="xs">
                <option value="option1">Option 1</option>
              </Select>
              <Input stateKey="garageKey" placeholder="Garage key" w="sm" />
            </Flex>
            <Textarea
              stateKey="description"
              w="3xl"
              placeholder="Description"
              size="md"
              resize="none"
            />
            <NumberInput
              stateKey="price"
              w={48}
              step={0.01}
              defaultValue={0}
              min={0}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Input stateKey="tags" placeholder="Tags" w={48} />
            <SelectImages<'images'> max={4} stateKey="images">
              {(state, onRemove) => {
                if (!state) return null;
                const { images } = { ...state };

                return (
                  <Grid
                    templateColumns="repeat(4, 1fr)"
                    templateRows="repeat(1, minmax(8rem, auto))"
                    gap={3}
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
                      >
                        <ImageWithFallback
                          h="full"
                          w="full"
                          imgUrl={URL.createObjectURL(image)}
                        />
                        <Button
                          colorScheme="red"
                          size="sm"
                          borderRadius={0}
                          onClick={() => onRemove(i)}
                        >
                          Remove
                        </Button>
                      </GridItem>
                    ))}
                  </Grid>
                );
              }}
            </SelectImages>

            <Flex>
              <SubmitButton
                onClick={() => null}
                colorScheme="red"
                w="2xs"
                lineHeight={1}
              >
                Upload Livery
              </SubmitButton>
              <Button
                colorScheme="red"
                variant="outline"
                w="2xs"
                lineHeight={1}
              >
                Cancel
              </Button>
            </Flex>
          </Form>
        </chakra.section>
      </Box>
    </MainLayout>
  );
};

export default Create;
