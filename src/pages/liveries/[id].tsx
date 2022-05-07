import React, { useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

import store from '../../store/store';
import {
  getLiveriesThunk,
  getLiveryThunk,
  LIVERY_SLICE_NAME
} from '../../store/livery/slice';

import { isString, numberToPrice } from '../../utils/functions';
import {
  Box,
  Button,
  chakra,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text
} from '@chakra-ui/react';
import { MainLayout } from '../../components/layout';
import { ImageWithFallback, Rating } from '../../components/core';
import { Breadcrumbs, Tags } from '../../components/core';
import { LiveryDataType } from '../../types';
import { FormattedMessage } from 'react-intl';
import { commonStrings } from '../../utils/intl';
import { LIVERIES_URL, LIVERY_URL } from '../../utils/nav';

type Props = Pick<
  LiveryDataType,
  | 'car'
  | 'creator'
  | 'title'
  | 'rating'
  | 'id'
  | 'downloads'
  | 'price'
  | 'images'
  | 'description'
  | 'tags'
>;
const Livery: NextPage<Props> = ({
  car,
  creator,
  description,
  downloads,
  id,
  images,
  price = 'Free',
  rating,
  tags,
  title
}) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const breadcrumbOptions = [
    {
      name: <FormattedMessage {...commonStrings.paintshop} />,
      href: LIVERIES_URL
    },
    {
      name: `${car} - ${title}`,
      href: undefined
    }
  ];

  return (
    <MainLayout
      pageTitle={`${car} - ${title}`}
      pageDescription={`View this livery!`}
      urlPath={LIVERY_URL(id)}
    >
      <Box maxW="5xl" display="flex" flexDir={'column'}>
        <Breadcrumbs options={breadcrumbOptions} />
        <chakra.section pt={8}>
          <Flex direction="column" maxW="5xl">
            <Heading size="xl" pb={4}>
              {`${car} - ${title}`}
            </Heading>
            <Rating rating={rating} alignItems="flex-start" />
            <Text fontSize="md" pt={1} pb={6}>
              <FormattedMessage
                {...commonStrings.downloads}
                values={{ downloads }}
              />
            </Text>
            <Grid
              templateColumns="repeat(24, 1fr)"
              templateRows="repeat(4, minmax(5rem, auto))"
              gap={4}
              w="5xl"
              pb={4}
            >
              <GridItem colSpan={5} rowSpan={4}>
                <Grid
                  templateColumns="repeat(1, 1fr)"
                  templateRows="repeat(4, 1fr)"
                  gap={2}
                  h="full"
                >
                  {Array(4)
                    .fill('')
                    .map((_, i) => {
                      const src = images[i];
                      return (
                        <Box
                          key={title + i}
                          position="relative"
                          borderRadius={3}
                          overflow="hidden"
                          onClick={() => setSelectedImage(i)}
                          borderColor={selectedImage === i ? 'red' : undefined}
                          borderWidth={2}
                        >
                          <ImageWithFallback
                            imgUrl={src}
                            imgAlt={title}
                            bg="gray.200"
                            h="full"
                            w="full"
                          />
                        </Box>
                      );
                    })}
                </Grid>
              </GridItem>
              <GridItem colSpan={14} rowSpan={4}>
                <Box
                  position="relative"
                  borderRadius={5}
                  overflow="hidden"
                  h="full"
                >
                  <ImageWithFallback
                    imgUrl={images[selectedImage]}
                    imgAlt={title}
                    bg="gray.200"
                    h="full"
                    w="full"
                  />
                </Box>
              </GridItem>
              <GridItem colSpan={5} rowSpan={4} pl={0}>
                <Heading size="md" pb={4}>
                  {creator.displayName}
                </Heading>
                <Text fontSize="sm" pb={4}>
                  {description}
                </Text>
              </GridItem>
            </Grid>
            <Tags pb={12} tags={tags?.split(',') || []} />
            <Heading size="md" pb={4}>
              {typeof price !== 'string' ? numberToPrice(price) : price}
            </Heading>
            <Button bg="gray.900" color="white" size="md" w={40} lineHeight={1}>
              <FormattedMessage {...commonStrings.addToBasket} />
            </Button>
          </Flex>
        </chakra.section>
      </Box>
    </MainLayout>
  );
};

export default Livery;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const paramsId = params?.id;
  let id = '';
  if (isString(paramsId)) id = paramsId;
  await store.dispatch(getLiveryThunk({ id }));
  const { entities } = store.getState()[LIVERY_SLICE_NAME];
  const {
    car,
    creator,
    title,
    rating,
    downloads,
    price,
    images,
    description,
    tags
  } = entities[id] as LiveryDataType;
  return {
    props: {
      car,
      creator,
      title,
      rating,
      id,
      downloads,
      price,
      images,
      description,
      tags
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  await store.dispatch(getLiveriesThunk({ filters: {}, quantity: 100 }));
  const { ids } = store.getState()[LIVERY_SLICE_NAME];

  return {
    paths: ids.map((id) => ({
      params: {
        id: `${id.valueOf()}`
      }
    })),
    fallback: 'blocking'
  };
};
