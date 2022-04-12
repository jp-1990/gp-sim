import React from 'react';
import Link from 'next/link';
import {
  LinkBox,
  LinkOverlay,
  Box,
  Flex,
  Grid,
  GridItem,
  Text
} from '@chakra-ui/react';

import { ImageWithFallback, Rating } from '../../../core';

interface Props {
  id: string;
  rating: number;
  downloads: number;
  imgUrl: string;
  price: number | string;
  author: string;
  title: string;
  car: string;
}
const LiveryCard: React.FC<Props> = ({
  id,
  rating,
  downloads = 0,
  imgUrl = '',
  price = 'Free',
  author,
  title,
  car
}) => {
  const mainColor = 'red';
  return (
    <LinkBox>
      <Link href={`/liveries/${id}`} passHref>
        <LinkOverlay>
          <Box
            position="relative"
            border="1px"
            borderRadius={5}
            borderColor="gray.200"
            overflow="hidden"
          >
            <Grid
              templateColumns="repeat(2, 1fr)"
              templateRows="repeat(3, minmax(5rem, auto))"
              p={2}
              zIndex="1"
              position="relative"
              top="0"
              left="0"
            >
              <GridItem colSpan={1} rowSpan={1}>
                <Flex
                  direction="column"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  h="full"
                ></Flex>
              </GridItem>
              <GridItem colSpan={1} rowSpan={1}>
                <Rating rating={rating} />
              </GridItem>
              <GridItem colSpan={2} rowSpan={1}></GridItem>
              <GridItem colSpan={1} rowSpan={1}>
                <Flex
                  direction="column"
                  alignItems="flex-start"
                  justifyContent="flex-end"
                  h="full"
                  maxW="15rem"
                  overflow="hidden"
                >
                  <Text
                    color={'white'}
                    borderRadius={2}
                    px={1}
                    bg={mainColor}
                    fontSize="sm"
                    isTruncated
                    noOfLines={1}
                  >
                    {author}
                  </Text>
                  <Text
                    color={'white'}
                    borderRadius={2}
                    px={1}
                    bg={'blackAlpha.800'}
                    fontSize="sm"
                    isTruncated
                    noOfLines={1}
                  >
                    {title}
                  </Text>
                  <Text
                    color={'white'}
                    borderRadius={2}
                    px={1}
                    bg={'blackAlpha.800'}
                    fontSize="sm"
                    isTruncated
                    noOfLines={1}
                  >
                    {car}
                  </Text>
                </Flex>
              </GridItem>
              <GridItem colSpan={1} rowSpan={1}>
                <Flex
                  direction="column"
                  alignItems="flex-end"
                  justifyContent="flex-end"
                  h="full"
                >
                  <Text
                    color={'white'}
                    borderRadius={2}
                    px={1}
                    bg={'blackAlpha.800'}
                    fontSize="sm"
                    isTruncated
                    noOfLines={1}
                  >
                    {price}
                  </Text>
                </Flex>
              </GridItem>
            </Grid>
            <ImageWithFallback
              imgAlt={title}
              imgUrl={imgUrl}
              position="absolute"
              top="0"
              left="0"
              zIndex="0"
              bg="gray.200"
              h="full"
              w="full"
            />
          </Box>
        </LinkOverlay>
      </Link>
    </LinkBox>
  );
};

export default LiveryCard;
