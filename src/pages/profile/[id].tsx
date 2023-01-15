import { Box, Flex, Heading, Text, HStack, Divider } from '@chakra-ui/react';
import { GetStaticPaths, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { ImageWithFallback } from '../../components/core';
import { LiveryList } from '../../components/features';
import LiveryFilter, {
  Mode
} from '../../components/features/liveries/LiveryFilter/LiveryFilter';
import { MainLayout } from '../../components/layout';

import {
  FilterActionPayload,
  actions as liveryActions,
  selectors as liverySelectors,
  thunks as liveryThunks
} from '../../store/livery/slice';
import { actions as userActions } from '../../store/user/slice';
import { actions as carActions } from '../../store/car/slice';
import { useAppDispatch, useAppSelector, wrapper } from '../../store/store';

import { useInfiniteScroll } from '../../hooks';
import { LiveriesDataType, LiveryDataType, UserDataType } from '../../types';
import { isString } from '../../utils/functions';
import { LIVERY_URL, PROFILE_URL_BY_ID, PROFILE_URL_ID } from '../../utils/nav';
import db, { CacheKeys } from '../../lib';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import { FormattedMessage } from 'react-intl';
import { profileStrings } from '../../utils/intl';
import { Icons } from '../../utils/icons/icons';

interface Props {
  id: string;
  user: UserDataType;
  _liveries: LiveriesDataType;
}
const Profile: NextPage<Props> = ({ id, user, _liveries }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) dispatch(userActions.setUser(user));
    if (_liveries) dispatch(liveryActions.setLiveries(_liveries));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(liveryActions.activatePage(PROFILE_URL_ID));
    return () => {
      dispatch(liveryActions.activatePage(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // HOOKS
  const filters = useAppSelector(liverySelectors.selectFilters);
  const lastLiveryId = useAppSelector(liverySelectors.selectLastLiveryId);
  const scrollY = useAppSelector(
    liverySelectors.createSelectScrollY(PROFILE_URL_ID)
  );

  const liveries = {
    ids: useAppSelector(liverySelectors.createSelectUserCreatedLiveryIds(id)),
    entities: useAppSelector(
      liverySelectors.createSelectUserCreatedLiveryEntities(id)
    )
  };

  const { Loader } = useInfiniteScroll(
    () => dispatch(liveryThunks.getLiveries({ ...filters, lastLiveryId })),
    liveries
  );

  // EFFECTS
  useEffect(() => {
    if (user.liveries.length) {
      setFilters({
        key: 'ids',
        value: user.liveries.join('&') ?? ''
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.liveries]);

  useEffect(() => {
    if (user.liveries.length) {
      dispatch(
        liveryThunks.getLiveries({
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
    dispatch(liveryActions.scrollYChanged(window.scrollY));
    router.push(LIVERY_URL(livery.id));
  };

  const setFilters = (payload: FilterActionPayload) =>
    dispatch(liveryActions.filtersChanged(payload));

  return (
    <MainLayout
      pageTitle="Profile"
      pageDescription="User profile home screen."
      urlPath={PROFILE_URL_BY_ID(id)}
    >
      <HStack alignItems={'flex-start'} pt={8} pr={8} w="5xl" gap={8}>
        <Flex direction="column" w="2xl">
          <Heading size="2xl" p={2}>
            {user.displayName}
          </Heading>
          <Divider />
          <Text fontSize="lg" pt={4} pl={2}>
            {user.about}
          </Text>
        </Flex>
        <Box
          position="relative"
          borderWidth="2px"
          rounded={'3xl'}
          borderColor={'blackAlpha.100'}
          overflow="hidden"
          h={'2xs'}
          w={'2xs'}
        >
          {user.image ? (
            <ImageWithFallback
              imgAlt={user.displayName}
              imgUrl={user.image ?? undefined}
            />
          ) : (
            <Flex
              w="100%"
              h="100%"
              bgColor="gray.100"
              justifyContent="center"
              alignItems="center"
            >
              <Icons.Person color="black" size={'12em'} />
            </Flex>
          )}
        </Box>
      </HStack>
      {/* liveries list */}
      <LiveryFilter
        mode={Mode.BASIC}
        filters={filters}
        setFilters={setFilters}
      />
      {!liveries.ids.length ? (
        <Text fontSize="lg" pt={12}>
          <FormattedMessage {...profileStrings.noLiveries} />
        </Text>
      ) : (
        <LiveryList liveries={liveries} onClickLivery={onClickLivery} />
      )}
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
      }

      // get user by id, cars and liveries
      let user;
      let cars;
      let liveries;

      if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
        user = await db.cache.getById(CacheKeys.USER, id);
        cars = await db.cache.get(CacheKeys.CAR);
        if (user) {
          liveries = [];
          for (const id of user.liveries) {
            const livery = await db.cache.getById(CacheKeys.LIVERY, id);
            if (livery) liveries.push(livery);
          }
        }
      }

      if (!user) {
        user = await db.getUserById(id);
      }
      if (!cars) {
        cars = await db.getCars();
      }
      if (!liveries && user) {
        liveries = [];
        for (const id of user.liveries) {
          const livery = await db.getLiveryById(id);
          if (livery) liveries.push(livery);
        }
      }

      if (!user || !cars) {
        return { notFound: true };
      }

      // set user and cars to store
      store.dispatch(userActions.setUser(user));
      store.dispatch(carActions.setCars(cars));
      if (liveries) store.dispatch(liveryActions.setLiveries(liveries));

      return {
        props: {
          id,
          user,
          _liveries: liveries
        }
      };
    }
);

export const getStaticPaths: GetStaticPaths = async () => {
  let users;

  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    users = await db.cache.get(CacheKeys.USER);
  }

  if (!users) {
    users = await db.getUsers();
  }

  return {
    paths: users.map(({ id }) => ({ params: { id } })),
    fallback: 'blocking'
  };
};
