import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { SelectFiles } from '../../../../../shared';
import { commonStrings, formStrings } from '../../../../../../utils/intl';
import { stateKeys, validators } from '../../config';
import { Box, Button, Flex } from '@chakra-ui/react';
import { ImageWithFallback } from '../../../../../core';
import { Icons } from '../../../../../../utils/icons/icons';

const ImageBox = ({
  image,
  name,
  onRemove
}: {
  image: string | File;
  name: string;
  onRemove: () => void;
}) => {
  return (
    <>
      <Box
        display="flex"
        flexDir="column"
        borderTop={4}
        overflow="hidden"
        position="relative"
        border="1px solid"
        borderColor="gray.200"
        w="xs"
        h="xs"
      >
        {image ? (
          <ImageWithFallback
            objectFit={'scale-down'}
            imgUrl={
              typeof image === 'string' ? image : URL.createObjectURL(image)
            }
            imgAlt={name}
          />
        ) : (
          <Flex
            h="xs"
            w="xs"
            bgColor="gray.100"
            justifyContent="center"
            alignItems="center"
          >
            <Icons.Person color="black" size={'14em'} />
          </Flex>
        )}
      </Box>
      <Button
        size="sm"
        w="xs"
        borderTopRadius={0}
        borderBottomRadius={4}
        onClick={onRemove}
        colorScheme="blackAlpha"
        fontWeight="normal"
        aria-label={`remove-${name}`}
      >
        {<FormattedMessage {...commonStrings.remove} />}
      </Button>
    </>
  );
};

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
        const image = images[0];
        return (
          <Box gap={3} pt={3}>
            <ImageBox
              image={image}
              name="profile image"
              onRemove={() => onRemove(0)}
            />
          </Box>
        );
      }}
    </SelectFiles>
  );
};

export default SelectProfileImage;
