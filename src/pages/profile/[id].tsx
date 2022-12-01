import { Box, Flex, Heading, Grid, Text, GridItem } from '@chakra-ui/react';
import { GetStaticPaths, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { ImageWithFallback } from '../../components/core';
import { LiveryList } from '../../components/features';
import LiveryFilter, {
  Mode
} from '../../components/features/liveries/LiveryFilter/LiveryFilter';
import { MainLayout } from '../../components/layout';
import { useInfiniteScroll } from '../../hooks';
import {
  activatePage,
  selectFilters,
  selectLastLiveryId,
  createSelectScrollY,
  selectLiveryEntities,
  selectLiveryIds,
  lastLiveryChanged,
  thunks,
  scrollYChanged,
  FilterActionPayload,
  filtersChanged
} from '../../store/livery/scroll-slice';
import store, {
  apiSlice,
  useAppDispatch,
  useAppSelector,
  wrapper
} from '../../store/store';
import {
  getUserById,
  getUsers,
  useGetUserByIdQuery
} from '../../store/user/api-slice';
import { LiveryDataType } from '../../types';
import { isString } from '../../utils/functions';
import { LIVERY_URL, PROFILE_URL_BY_ID, PROFILE_URL_ID } from '../../utils/nav';

interface Props {
  id: string;
}
const Profile: NextPage<Props> = ({ id }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(activatePage(PROFILE_URL_ID));
    return () => {
      dispatch(activatePage(null));
    };
  }, [dispatch]);

  // HOOKS
  const filters = useAppSelector(selectFilters);
  const lastLiveryId = useAppSelector(selectLastLiveryId);
  const scrollY = useAppSelector(createSelectScrollY(PROFILE_URL_ID));

  const liveries = {
    ids: useAppSelector(selectLiveryIds),
    entities: useAppSelector(selectLiveryEntities)
  };

  const { Loader } = useInfiniteScroll(lastLiveryChanged, liveries);

  // QUERIES
  const { data: selectedUser } = useGetUserByIdQuery(id);

  useEffect(() => {
    if (selectedUser?.liveries.length) {
      setFilters({
        key: 'ids',
        value: selectedUser?.liveries.join('&') ?? ''
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser?.liveries]);

  useEffect(() => {
    if (selectedUser?.liveries.length) {
      dispatch(
        thunks.getLiveries({
          ...filters,
          lastLiveryId
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, lastLiveryId]);

  useEffect(() => {
    if (scrollY)
      window.scrollTo({
        top: scrollY,
        behavior: 'auto'
      });
  }, [scrollY]);

  // HANDLERS
  const onClickLivery = (livery: LiveryDataType) => {
    dispatch(scrollYChanged(window.scrollY));
    router.push(LIVERY_URL(livery.id));
  };

  const setFilters = (payload: FilterActionPayload) =>
    dispatch(filtersChanged(payload));

  return (
    <MainLayout
      pageTitle="Profile"
      pageDescription="User profile home screen."
      urlPath={PROFILE_URL_BY_ID(id)}
    >
      <Grid
        pt={8}
        pr={8}
        maxW="5xl"
        templateColumns={`repeat(2, auto)`}
        gap={8}
      >
        <GridItem>
          <Flex direction="column" maxW="5xl">
            <Heading size="2xl" pb={4}>
              {selectedUser?.displayName}
            </Heading>
            <Text fontSize="lg" pt={2}>
              {selectedUser?.about}
            </Text>
          </Flex>
        </GridItem>
        <GridItem>
          <Box
            position="relative"
            borderWidth="2px"
            borderRadius={200}
            borderColor={'blackAlpha.100'}
            overflow="hidden"
            h={200}
            w={200}
          >
            <ImageWithFallback
              imgAlt={selectedUser?.displayName}
              imgUrl={selectedUser?.image ?? undefined}
            />
          </Box>
        </GridItem>
      </Grid>
      {/* liveries list */}
      <LiveryFilter
        mode={Mode.BASIC}
        filters={filters}
        setFilters={setFilters}
      />
      <LiveryList liveries={liveries} onClickLivery={onClickLivery} />
      <Loader />
    </MainLayout>
  );
};

export default Profile;

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ params }) => {
      const paramsId = params?.id;
      let id = '';
      if (isString(paramsId)) {
        id = paramsId;
        store.dispatch(getUserById.initiate(id));
        await Promise.all(apiSlice.util.getRunningOperationPromises());
      }
      return {
        props: {
          id
        }
      };
    }
);

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await store.dispatch(getUsers.initiate({}));
  const ids = data?.ids ?? [];
  return {
    paths: ids.map((id) => ({
      params: {
        id: `${id.valueOf()}`
      }
    })),
    fallback: 'blocking'
  };
};
