import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { GetStaticPaths, NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  chakra,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  useToast
} from '@chakra-ui/react';

import store, {
  apiSlice,
  useAppDispatch,
  useAppSelector,
  wrapper
} from '../../store/store';
import {
  getLiveries,
  getLiveryById,
  useGetLiveryByIdQuery
} from '../../store/livery/api-slice';

import { MainLayout } from '../../components/layout';
import { ImageWithFallback, Rating, Tags } from '../../components/core';

import { isString } from '../../utils/functions';
import { commonStrings, formStrings, liveryStrings } from '../../utils/intl';
import { LIVERY_URL, LOGIN_URL } from '../../utils/nav';
import { useUpdateUserLiveriesMutation } from '../../store/user/api-slice';
import { updateLiveries } from '../../store/user/slice';

interface Props {
  id: string;
}
const Livery: NextPage<Props> = ({ id }) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const toast = useToast({
    duration: 8000,
    isClosable: true,
    position: 'top',
    containerStyle: {
      marginTop: '1.25rem'
    }
  });

  const currentUser = useAppSelector((state) => state.currentUserSlice);

  const { data: livery } = useGetLiveryByIdQuery(id);
  const [updateUserLiveries, { isLoading }] = useUpdateUserLiveriesMutation();

  const isInUserCollection = currentUser.data?.liveries.includes(id);

  const onAddToCollection = async () => {
    const payload = [id];
    if (!currentUser.token) return router.push(LOGIN_URL);

    try {
      await updateUserLiveries({
        liveries: payload,
        token: currentUser.token
      }).unwrap();

      dispatch(updateLiveries(payload));

      toast({
        title: intl.formatMessage(formStrings.updateSuccess, {
          item: intl.formatMessage(commonStrings.liveries)
        }),
        status: 'success'
      });
    } catch (err) {
      toast({
        title: intl.formatMessage(formStrings.updateError, {
          item: intl.formatMessage(commonStrings.liveries).toLocaleLowerCase()
        }),
        status: 'error'
      });
    }
  };

  return (
    <MainLayout
      pageTitle={`${livery?.car} - ${livery?.title}`}
      pageDescription={`View this livery!`}
      urlPath={LIVERY_URL(id)}
    >
      <Box maxW="5xl" display="flex" flexDir={'column'}>
        <chakra.section pt={8}>
          <Flex direction="column" maxW="5xl">
            <Heading size="xl" pb={4}>
              {`${livery?.car} - ${livery?.title}`}
            </Heading>
            <Rating rating={livery?.rating} alignItems="flex-start" />
            <Text fontSize="md" pt={1} pb={6}>
              <FormattedMessage
                {...commonStrings.downloads}
                values={{ downloads: livery?.downloads || '-' }}
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
                      const src = livery?.images[i] || '';
                      return (
                        <Box
                          key={(livery?.title ?? '') + i}
                          position="relative"
                          borderRadius={3}
                          overflow="hidden"
                          onClick={() => setSelectedImage(i)}
                          borderColor={selectedImage === i ? 'red' : undefined}
                          borderWidth={2}
                        >
                          <ImageWithFallback
                            imgUrl={src}
                            imgAlt={livery?.title}
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
                    imgUrl={livery?.images[selectedImage]}
                    imgAlt={livery?.title}
                    bg="gray.200"
                    h="full"
                    w="full"
                  />
                </Box>
              </GridItem>
              <GridItem colSpan={5} rowSpan={4} pl={0}>
                <Heading size="md" pb={4}>
                  {livery?.creator.displayName}
                </Heading>
                <Text fontSize="sm" pb={4}>
                  {livery?.description}
                </Text>
              </GridItem>
            </Grid>
            <Tags pb={12} tags={livery?.tags?.split(',') || []} />
            {!isInUserCollection && (
              <Button
                bg="gray.900"
                color="white"
                size="md"
                w={40}
                lineHeight={1}
                disabled={isLoading}
                onClick={onAddToCollection}
              >
                <FormattedMessage {...commonStrings.addToCollection} />
              </Button>
            )}
            {isInUserCollection && (
              <Heading size="md" pb={4}>
                <FormattedMessage {...liveryStrings.inColletion} />
              </Heading>
            )}
          </Flex>
        </chakra.section>
      </Box>
    </MainLayout>
  );
};

export default Livery;

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ params }) => {
      const paramsId = params?.id;
      let id = '';
      if (isString(paramsId)) id = paramsId;
      store.dispatch(getLiveryById.initiate(id));
      await Promise.all(apiSlice.util.getRunningOperationPromises());
      return {
        props: {
          id
        }
      };
    }
);

export const getStaticPaths: GetStaticPaths = async () => {
  // @ts-expect-error no idea
  const { data } = await store.dispatch(getLiveries.initiate({}));
  const ids = (data as any)?.ids ?? [];
  return {
    paths: ids.map((id: any) => ({
      params: {
        id: `${id.valueOf()}`
      }
    })),
    fallback: 'blocking'
  };
};
