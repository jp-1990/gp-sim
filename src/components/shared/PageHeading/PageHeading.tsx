import React from 'react';
import { chakra, Flex, Heading, Text } from '@chakra-ui/react';

interface Props {
  heading: React.ReactNode;
  paragraph?: React.ReactNode;
}
const PageHeading: React.FC<Props> = ({ heading, paragraph }) => {
  return (
    <chakra.section pt={8}>
      <Flex direction="column" maxW="5xl">
        <Heading size="2xl" pb={4}>
          {heading}
        </Heading>
        {paragraph && (
          <Text fontSize="lg" pt={2}>
            {paragraph}
          </Text>
        )}
      </Flex>
    </chakra.section>
  );
};

export default PageHeading;
