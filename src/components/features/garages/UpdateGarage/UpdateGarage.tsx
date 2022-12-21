import { Grid, GridItem, Button, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import { thunks } from '../../../../store/garage/slice';
import { useAppDispatch } from '../../../../store/store';
import { GarageDataType, RequestStatus } from '../../../../types';
import {
  commonStrings,
  formStrings,
  garageStrings
} from '../../../../utils/intl';
import { ImageWithFallback } from '../../../core';
import { Form, Input, SubmitButton, Textarea, useForm } from '../../../shared';

import { UpdateGarageFormStateType } from '../types';
import { stateKeys, validators } from './config';

type Props = Pick<
  GarageDataType,
  'id' | 'title' | 'description' | 'drivers' | 'image'
>;

const UpdateGarage: React.FC<Props> = ({
  title,
  description,
  drivers,
  image,
  id
}) => {
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

  const { state, setStateImmutably } = useForm<UpdateGarageFormStateType>();

  useEffect(() => {
    setStateImmutably((state) => {
      state.title = title;
      state.description = description;
      state.drivers = drivers;
      state.imageFiles = [];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    const newFiles = Array.from(event.target.files);
    setStateImmutably((prev) => {
      prev.imageFiles = newFiles;
    });
  };

  const onClick = async () => {
    setIsLoading(true);
    try {
      if (!isLoading) {
        const { title, description } = state;

        const updateGarageInput = {
          title,
          description
        };

        // append values to form data
        const formData = new FormData();
        for (const [key, value] of Object.entries(updateGarageInput)) {
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
        } = await dispatch(thunks.updateGarageById({ id, data: formData }));

        if (requestStatus === RequestStatus.REJECTED) throw new Error();

        toast({
          title: intl.formatMessage(formStrings.updateSuccess, {
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
        description: intl.formatMessage(formStrings.updateError, {
          item: intl.formatMessage(commonStrings.garage)
        }),
        status: 'error'
      });
      setIsLoading(false);
    }
  };

  const imageUrl = () => {
    const newImageFiles = state[stateKeys.IMAGE_FILES] || [];
    if (newImageFiles[0])
      return {
        imgUrl: URL.createObjectURL(newImageFiles[0]),
        imgAlt: intl.formatMessage(formStrings.garageImage)
      };
    return {
      imgUrl: image,
      imgAlt: intl.formatMessage(formStrings.garageImage)
    };
  };

  return (
    <Grid
      templateColumns="repeat(12, 1fr)"
      templateRows="repeat(5)"
      gap={4}
      w="5xl"
      my={8}
    >
      <GridItem rowSpan={1} colSpan={6}>
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
      <GridItem rowSpan={1} colSpan={2} />
      <GridItem
        mt={6}
        colSpan={4}
        rowSpan={2}
        display="flex"
        flexDir="column"
        borderRadius={4}
        overflow="hidden"
        position="relative"
        border="1px solid"
        borderColor="gray.200"
      >
        <ImageWithFallback h="full" w="full" {...imageUrl()} />
        <Button
          as="label"
          size="sm"
          borderRadius={0}
          onClick={() => null}
          colorScheme="blackAlpha"
          fontWeight="normal"
          aria-label={`change-${image}`}
          htmlFor={'image-input'}
        >
          {<FormattedMessage {...commonStrings.change} />}
        </Button>
        <input
          hidden
          multiple
          type="file"
          accept="image/png,image/jpeg,image/webp"
          id={'image-input'}
          onChange={onImageChange}
        />
      </GridItem>
      <GridItem rowSpan={1} colSpan={6}>
        <Textarea
          validators={validators.description}
          stateKey={stateKeys.DESCRIPTION}
          aria-label={intl.formatMessage(formStrings.description)}
          label={<FormattedMessage {...formStrings.description} />}
          w="lg"
          h="36"
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
      <GridItem rowSpan={1} colSpan={12} />
      <GridItem rowSpan={1} colSpan={3}>
        <SubmitButton
          onClick={onClick}
          colorScheme="red"
          w="2xs"
          lineHeight={1}
          isLoading={isLoading}
        >
          {<FormattedMessage {...garageStrings.updateGarage} />}
        </SubmitButton>
      </GridItem>
    </Grid>
  );
};

const UpdateGarageWithForm: React.FC<Props> = (props) => (
  <Form>
    <UpdateGarage {...props} />
  </Form>
);
export default UpdateGarageWithForm;
