import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { SelectFiles } from '../../../../../shared';
import { commonStrings, formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';
import { Button, Grid, GridItem } from '@chakra-ui/react';
import { ImageWithFallback } from '../../../../../core';

/**
 * Select image input for garages/create page. Uses SelectFiles inside a form provider and displays the selected image to the user.
 */
const SelectLiveryImages = () => {
  const intl = useIntl();
  return (
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
  );
};

export default SelectLiveryImages;
