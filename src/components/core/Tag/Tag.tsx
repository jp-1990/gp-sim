import React from 'react';
import { Center, ChakraComponent, Text } from '@chakra-ui/react';

interface TagProps {
  tag: string;
}
const Tag: ChakraComponent<'div', TagProps> = ({ tag, ...chakraProps }) => {
  return (
    <Center
      py={1}
      px={3}
      mr={1}
      borderRadius={8}
      border="1px solid"
      borderColor="gray.500"
      bg="gray.100"
      {...chakraProps}
    >
      <Text fontSize="sm" color="gray.600">
        {tag}
      </Text>
    </Center>
  );
};

export default Tag;
