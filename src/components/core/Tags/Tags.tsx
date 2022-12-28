import React from 'react';
import {
  Center,
  ComponentWithAs,
  Flex,
  FlexProps,
  Text
} from '@chakra-ui/react';

const buildTags = (tags: string[]) => {
  return tags.map((tag, i) => (
    <Center
      key={tag + i}
      bg="white"
      py={1}
      px={3}
      mr={2}
      borderRadius={3}
      border="1px solid"
      borderColor="gray.500"
    >
      <Text fontSize="sm" color="gray.600">
        {tag}
      </Text>
    </Center>
  ));
};

interface Props {
  tags: string[];
}
/**
 *
 * @param {Props['tags']} props.tags - String[ ]. Array of tags
 * @returns Function Component
 *
 * @description Renders a list of tags. Primarily intended to display search tags associated with an item.
 */
const Tags: ComponentWithAs<'div', FlexProps & Props> = ({
  tags,
  ...props
}) => {
  const tags_ = tags.filter((tag) => tag);
  if (!tags_.length) return <></>;
  return <Flex {...props}>{buildTags(tags_)}</Flex>;
};

export default Tags;
