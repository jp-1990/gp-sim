import React from 'react';
import { GetStaticPaths, NextPage } from 'next';
import { FormattedMessage } from 'react-intl';
import {
  Box,
  chakra,
  Flex,
  Heading,
  HStack,
  Text,
  VStack
} from '@chakra-ui/react';

import { MainLayout } from '../../../components/layout';
import UpdateLivery from '../../../components/features/liveries/UpdateLivery/UpdateLivery';
import { Unauthorized } from '../../../components/shared';

import { wrapper } from '../../../store/store';
import { commonStrings, liveryStrings } from '../../../utils/intl';
import { LIVERY_UPDATE_URL } from '../../../utils/nav';
import { isString } from '../../../utils/functions';
import { useAuthCheck } from '../../../hooks/use-auth-check';
import { actions as liveryActions } from '../../../store/livery/slice';
import db, { CacheKeys } from '../../../lib';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import { LiveryDataType } from '../../../types';
import { ImageWithFallback } from '../../../components/core';

const Create: NextPage<{ id: string; livery: LiveryDataType }> = ({
  id,
  livery
}) => {
  // AUTH CHECK
  const { currentUser } = useAuthCheck();

  if (!currentUser.token || currentUser.data?.id !== livery.creator.id)
    return <Unauthorized />;
  return (
    <MainLayout
      pageTitle="Update Livery"
      pageDescription="Update your livery!"
      urlPath={LIVERY_UPDATE_URL(id)}
    >
      <Box maxW="5xl" w="5xl" display="flex" flexDir={'column'}>
        <chakra.section pt={8}>
          <Flex direction="column" maxW="5xl">
            <Heading size="xl" pb={4}>
              <FormattedMessage {...liveryStrings.updateHeading} />
            </Heading>
            <Text fontSize="md">
              <FormattedMessage {...liveryStrings.updateSummary} />
            </Text>
          </Flex>
        </chakra.section>

        <chakra.section pt={6}>
          <HStack
            gap={8}
            p={4}
            w={'fit-content'}
            borderRadius={4}
            bgColor="gray.100"
          >
            <VStack alignItems={'flex-start'}>
              <Heading size="md">{`${livery?.title}`}</Heading>
              <Text size="md" pb={2}>
                {`${livery?.car}`}
              </Text>
              <Text fontSize="sm">
                <FormattedMessage
                  {...commonStrings.downloads}
                  values={{ downloads: livery?.downloads || '0' }}
                />
              </Text>
            </VStack>
            <Box
              position="relative"
              borderWidth="2px"
              borderRadius={6}
              borderColor={'blackAlpha.100'}
              overflow="hidden"
              h="93px"
              w="165px"
            >
              <ImageWithFallback
                imgAlt={'livery image'}
                imgUrl={livery.images[0]}
              />
            </Box>
          </HStack>
        </chakra.section>

        <UpdateLivery livery={livery} />
      </Box>
    </MainLayout>
  );
};

export default Create;

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ params }) => {
      const paramsId = params?.id;
      let id = '';
      if (isString(paramsId)) id = paramsId;

      let livery;

      if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
        livery = await db.cache.getById(CacheKeys.LIVERY, id);
      }

      if (!livery) {
        livery = await db.getLiveryById(id);
      }

      if (livery) store.dispatch(liveryActions.setLiveries([livery]));

      return {
        props: {
          id,
          livery
        }
      };
    }
);

export const getStaticPaths: GetStaticPaths = async () => {
  let liveries;

  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    liveries = await db.cache.get(CacheKeys.LIVERY);
  }

  if (!liveries) {
    liveries = await db.getLiveries();
  }

  return {
    paths: liveries.map(({ id }) => ({ params: { id } })),
    fallback: 'blocking'
  };
};
