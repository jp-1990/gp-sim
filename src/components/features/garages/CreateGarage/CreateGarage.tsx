import { Grid, GridItem, Divider, Button, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import { thunks } from '../../../../store/garage/slice';
import { useAppDispatch } from '../../../../store/store';
import { RequestStatus } from '../../../../types';
import {
  commonStrings,
  formStrings,
  garageStrings
} from '../../../../utils/intl';
import { ImageWithFallback } from '../../../core';
import {
  Form,
  Input,
  SelectFiles,
  SubmitButton,
  Textarea,
  useForm
} from '../../../shared';
import { CreateGarageFormStateType } from '../types';
import { mapCreateGarageFormStateToRequestInput } from '../utils';

import { initialState, stateKeys, validators } from './config';

const CreateGarage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();

  const toast = useToast({
    duration: 8000,
    isClosable: true,
    position: 'top',
    containerStyle: {
      marginTop: '1.25rem'
    }
  });
  const dispatch = useAppDispatch();

  const user = {};
  const { state, resetState } = useForm<CreateGarageFormStateType>();

  const onClick = async () => {
    try {
      if (!isLoading) {
        const createGarageInput = {
          // map state into upload format
          ...mapCreateGarageFormStateToRequestInput({
            formState: state,
            user
          })
        };

        // append values to form data
        const formData = new FormData();
        for (const [key, value] of Object.entries(createGarageInput)) {
          formData.append(key, `${value}`);
        }
        for (const image of state.imageFiles || []) {
          if (image) {
            const buffer = await image.arrayBuffer();
            const blob = new Blob([new Uint8Array(buffer)], {
              type: image.type
            });
            formData.append('imageFile', blob, image.name);
          }
        }

        const {
          meta: { requestStatus }
        } = await dispatch(thunks.createGarage(formData));

        if (requestStatus === RequestStatus.REJECTED) throw new Error();

        resetState(initialState);
        toast({
          title: intl.formatMessage(formStrings.createSuccess, {
            item: intl.formatMessage(commonStrings.garage)
          }),
          description: `${state.title}`,
          status: 'success'
        });
        setIsLoading(false);
      }
    } catch (_) {
      toast({
        title: intl.formatMessage(commonStrings.error),
        description: intl.formatMessage(formStrings.createError, {
          item: intl.formatMessage(commonStrings.garage)
        }),
        status: 'error'
      });
      setIsLoading(false);
    }
  };

  return (
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
          aria-label={intl.formatMessage(formStrings.title)}
          placeholder={intl.formatMessage({
            ...formStrings.titlePlaceholder
          })}
          w="sm"
        />
      </GridItem>
      <GridItem rowSpan={1} colSpan={12}>
        <Textarea
          validators={validators.description}
          stateKey={stateKeys.DESCRIPTION}
          aria-label={intl.formatMessage(formStrings.description)}
          label={<FormattedMessage {...formStrings.description} />}
          w="3xl"
          placeholder={intl.formatMessage(
            {
              ...formStrings.descriptionPlaceholder
            },
            { item: intl.formatMessage({ ...commonStrings.garage }) }
          )}
          size="md"
          resize="none"
        />
      </GridItem>
      <GridItem rowSpan={1} colSpan={12} mt={5} mb={3}>
        <SelectFiles<typeof stateKeys.IMAGE_FILES>
          validators={validators.imageFiles}
          stateKey={stateKeys.IMAGE_FILES}
          label={<FormattedMessage {...commonStrings.selectImage} />}
          aria-label={intl.formatMessage(commonStrings.selectImage)}
          max={1}
          accept="image/png,image/jpeg,image/webp"
          helperText={
            <FormattedMessage {...formStrings.selectGarageImageHelperText} />
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
                      imgAlt={image.name}
                    />
                    <Button
                      size="sm"
                      borderRadius={0}
                      onClick={() => onRemove(i)}
                      colorScheme="blackAlpha"
                      fontWeight="normal"
                      aria-label={`remove-${image.name}`}
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
          onClick={onClick}
          colorScheme="red"
          w="2xs"
          lineHeight={1}
          isLoading={isLoading}
        >
          {<FormattedMessage {...garageStrings.createGarage} />}
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
  );
};

const CreateGarageWithForm: React.FC = () => (
  <Form>
    <CreateGarage />
  </Form>
);
export default CreateGarageWithForm;
