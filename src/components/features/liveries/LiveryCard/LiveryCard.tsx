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
import { LiveryDataType } from '../../../../types';
import { LIVERY_URL } from '../../../../utils/nav';
import { numberToPrice } from '../../../../utils/functions';

type Props = Pick<
  LiveryDataType,
  'title' | 'car' | 'id' | 'price' | 'rating' | 'creator'
> & { image: string };

/**
 *
 * @param {Props['car']} props.car
 * @param {Props['creator']} props.creator
 * @param {Props['id']} props.id
 * @param {Props['image']} props.image
 * @param {Props['price']} props.price
 * @param {Props['rating']} props.rating
 * @param {Props['title']} props.title
 * @returns Function Component
 *
 * @description A card to render a livery preview. Intended to be used in a list to render previews of multiple liveries.
 */
const LiveryCard: React.FC<Props> = ({
  car,
  creator,
  id,
  image = '',
  price = 'Free',
  rating,
  title
}) => {
  const mainColor = 'red';
  return (
    <LinkBox>
      <Link href={LIVERY_URL(id)} passHref>
        <LinkOverlay>
          <Box
            position="relative"
            border="1px"
            borderRadius={5}
            borderColor="gray.200"
            overflow="hidden"
          >
            <Grid
              templateColumns="repeat(6, 1fr)"
              templateRows="repeat(3, minmax(5rem, auto))"
              p={2}
              zIndex="1"
              position="relative"
              top="0"
              left="0"
            >
              <GridItem colSpan={4} rowSpan={1}>
                <Flex
                  direction="column"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  h="full"
                ></Flex>
              </GridItem>
              <GridItem colSpan={2} rowSpan={1}>
                <Rating rating={rating} />
              </GridItem>
              <GridItem colSpan={6} rowSpan={1}></GridItem>
              <GridItem colSpan={5} rowSpan={1}>
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
                    noOfLines={1}
                  >
                    {creator.displayName}
                  </Text>
                  <Text
                    color={'white'}
                    borderRadius={2}
                    px={1}
                    bg={'blackAlpha.800'}
                    fontSize="sm"
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
                    noOfLines={1}
                  >
                    {typeof price !== 'string' ? numberToPrice(price) : price}
                  </Text>
                </Flex>
              </GridItem>
            </Grid>
            <ImageWithFallback
              imgAlt={title}
              imgUrl={image}
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
