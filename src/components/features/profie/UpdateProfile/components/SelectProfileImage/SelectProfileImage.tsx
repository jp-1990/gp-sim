import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { SelectFiles } from '../../../../../shared';
import { commonStrings, formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';
import { Box, Button } from '@chakra-ui/react';
import { ImageWithFallback } from '../../../../../core';

/**
 * Select image input for profile page. Uses SelectFiles inside a form provider and displays the selected image to the user.
 */
const SelectProfileImage = () => {
  const intl = useIntl();
  return (
    <SelectFiles<typeof stateKeys.IMAGE_FILES>
      validators={validators[stateKeys.IMAGE_FILES]}
      stateKey={stateKeys.IMAGE_FILES}
      label={<FormattedMessage {...commonStrings.selectImage} />}
      aria-label={intl.formatMessage(commonStrings.selectImage)}
      max={1}
      accept="image/png,image/jpeg,image/webp"
      helperText={
        <FormattedMessage {...formStrings.selectProfileImageHelperText} />
      }
    >
      {(state, onRemove) => {
        if (!state) return null;
        const { [stateKeys.IMAGE_FILES]: images } = { ...state };
        return (
          <Box gap={3} pt={3}>
            {images.map((image, i) => (
              <Box
                key={i}
                display="flex"
                flexDir="column"
                borderRadius={4}
                overflow="hidden"
                position="relative"
                border="1px solid"
                borderColor="gray.200"
                w="xs"
              >
                <ImageWithFallback
                  position={'relative'}
                  h="xs"
                  w="xs"
                  imgUrl={URL.createObjectURL(image)}
                  imgAlt={image.name}
                />
                <Button
                  size="sm"
                  w="xs"
                  borderRadius={0}
                  onClick={() => onRemove(i)}
                  colorScheme="blackAlpha"
                  fontWeight="normal"
                  aria-label={`remove-${image.name}`}
                >
                  {<FormattedMessage {...commonStrings.remove} />}
                </Button>
              </Box>
            ))}
          </Box>
        );
      }}
    </SelectFiles>
  );
};

export default SelectProfileImage;
