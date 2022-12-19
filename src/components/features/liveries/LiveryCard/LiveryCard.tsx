import React from 'react';
import { LinkBox, Flex, Text } from '@chakra-ui/react';

import { ImageWithFallback, Rating } from '../../../core';
import { LiveryDataType } from '../../../../types';
import { LIVERY_URL } from '../../../../utils/nav';
import Link from 'next/link';
// import { numberToPrice } from '../../../../utils/functions';

type Props = Pick<
  LiveryDataType,
  'title' | 'car' | 'id' | 'price' | 'rating' | 'creator'
> & { image: string; onClick?: () => void };

/**
 *
 * @param {Props['car']} props.car
 * @param {Props['creator']} props.creator
 * @param {Props['id']} props.id
 * @param {Props['image']} props.image
 * @param {Props['price']} props.price
 * @param {Props['rating']} props.rating
 * @param {Props['title']} props.title
 * @param {Props['onClick']} props.onClick
 * @returns Function Component
 *
 * @description A card to render a livery preview. Intended to be used in a list to render previews of multiple liveries.
 */
const LiveryCard: React.FC<Props> = ({
  car,
  creator,
  id,
  image = '',
  // price,
  rating,
  title,
  onClick
}) => {
  const onClick_ = onClick ?? (() => null);

  const mainColor = 'red';
  return (
    <LinkBox as="button" onClick={onClick_}>
      <Link href={`${LIVERY_URL(id)}`} passHref>
        <Flex
          direction={'column'}
          position="relative"
          border="1px"
          borderRadius={5}
          borderColor="gray.200"
          overflow="hidden"
          w="320px"
          h="180px"
        >
          <Flex p={2} zIndex="1" position="relative">
            <Flex flex={1} />
            <Rating rating={rating} />
          </Flex>
          <Flex h={'full'} opacity={0.7} />
          <Flex p={2} zIndex="2" position="relative">
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
            {/* <Flex flex={1} />
            <Flex
              direction="column"
              alignItems="flex-end"
              justifyContent="flex-end"
              minW="52px"
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
            </Flex> */}
          </Flex>
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
        </Flex>
      </Link>
    </LinkBox>
  );
};

export default LiveryCard;
