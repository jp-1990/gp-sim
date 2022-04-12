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
const Tags: ComponentWithAs<'div', FlexProps & Props> = ({
  tags,
  ...props
}) => {
  return <Flex {...props}>{buildTags(tags)}</Flex>;
};

export default Tags;
