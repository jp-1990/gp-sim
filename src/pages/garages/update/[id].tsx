/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react';
import { GetStaticPaths, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';
import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react';

import { MainLayout } from '../../../components/layout';
import { Table } from '../../../components/shared/Table/Table';
import { TableDataTypes } from '../../../components/shared/Table/types';

import UpdateGarage from '../../../components/features/garages/UpdateGarage/UpdateGarage';

import { useAppDispatch, useAppSelector, wrapper } from '../../../store/store';
import {
  FilterActionPayload,
  actions as liveryActions,
  selectors as liverySelectors,
  thunks as liveryThunks
} from '../../../store/livery/slice';
import {
  actions as garageActions,
  thunks as garageThunks,
  selectors as garageSelectors
} from '../../../store/garage/slice';
import {
  actions as userActions,
  thunks as userThunks,
  selectors as userSelectors
} from '../../../store/user/slice';

import {
  GARAGES_URL_ID,
  GARAGE_UPDATE_URL,
  LIVERY_URL,
  PROFILE_URL_BY_ID
} from '../../../utils/nav';
import {
  commonStrings,
  formStrings,
  garageStrings,
  profileStrings
} from '../../../utils/intl';
import { isString } from '../../../utils/functions';

import {
  LiveriesDataType,
  PublicUserDataType,
  UserFilterKeys,
  UsersDataType
} from '../../../types';
import {
  useInfiniteScroll,
  useUserFilters,
  useAuthCheck
} from '../../../hooks';
import { Unauthorized } from '../../../components/shared';
import db, { CacheKeys } from '../../../lib';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';

interface Props {
  id: string;
}
const Update: NextPage<Props> = ({ id }) => {
  // AUTH CHECK
  const { currentUser } = useAuthCheck();

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentUser.token && currentUser.data) {
      dispatch(liveryActions.activatePage(GARAGES_URL_ID));
      dispatch(garageThunks.getGarageById({ id }));
      dispatch(userThunks.getUsers(userFilters));
    }
    return () => {
      dispatch(liveryActions.activatePage(null));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.token, currentUser.data, dispatch, id]);

  // STATE
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [modal, setModal] = useState({
    ids: undefined as string[] | undefined,
    type: undefined as 'drivers' | 'liveries' | undefined,
    open: false
  });

  // HOOKS
  const filters = useAppSelector(liverySelectors.selectFilters);
  const lastLiveryId = useAppSelector(liverySelectors.selectLastLiveryId);
  const scrollY = useAppSelector(
    liverySelectors.createSelectScrollY(GARAGES_URL_ID)
  );
  const selectedLiveries = useAppSelector(
    liverySelectors.selectSelectedLiveries
  );
  const garageData = useAppSelector(garageSelectors.createSelectGarageById(id));

  const liveries = {
    ids: useAppSelector(liverySelectors.selectLiveryIds),
    entities: useAppSelector(liverySelectors.selectLiveryEntities)
  };

  const users = {
    ids: useAppSelector(userSelectors.selectUserIds),
    entities: useAppSelector(userSelectors.selectUserEntities)
  };

  const { Loader } = useInfiniteScroll(
    () => dispatch(liveryThunks.getLiveries({ ...filters, lastLiveryId })),
    liveries
  );

  const { filters: userFilters, setFilters: setUserFilters } = useUserFilters();

  const deleters = {
    liveries: async (id: string, ids: string[]) => {
      const formData = new FormData();
      formData.append('liveriesToRemove', JSON.stringify(ids));
      dispatch(garageThunks.updateGarageByIdLiveries({ id, formData }));
    },
    drivers: async (id: string, ids: string[]) => {
      const formData = new FormData();
      formData.append('usersToRemove', JSON.stringify(ids));
      dispatch(garageThunks.updateGarageByIdUsers({ id, formData }));
    }
  };

  // EFFECTS
  useEffect(() => {
    if (currentUser.token) {
      setLiveryFilters({
        key: 'ids',
        value: garageData?.liveries.join('&') ?? ''
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (currentUser.token) {
      dispatch(liveryThunks.getLiveries({ ...filters, lastLiveryId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, filters, lastLiveryId]);

  useEffect(() => {
    if (scrollY && currentUser.token)
      window.scrollTo({
        top: scrollY,
        behavior: 'auto'
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, scrollY]);

  useEffect(() => {
    if (garageData?.drivers) {
      setUserFilters({
        key: UserFilterKeys.IDS,
        value: garageData?.drivers.join('&')
      });
    }
  }, [garageData?.drivers, setUserFilters]);

  // HANDLERS;s
  const toggleSelectedDrivers = (id: string | string[]) => {
    if (typeof id === 'object') return setSelectedDrivers(id);
    setSelectedDrivers((prev) => {
      if (prev.includes(id)) return prev.filter((prevId) => id !== prevId);
      return [...prev, id];
    });
  };

  const setLiveryFilters = (payload: FilterActionPayload) =>
    dispatch(liveryActions.filtersChanged(payload));

  const toggleSelectedLiveries = (payload: string | string[]) =>
    dispatch(liveryActions.selectedLiveriesChanged(payload));

  const onClickLivery = (id: string) => {
    dispatch(liveryActions.scrollYChanged(window.scrollY));
    router.push(LIVERY_URL(id));
  };

  const onOpenModal = (
    id: string,
    ids_: string[],
    type: 'drivers' | 'liveries'
  ) => {
    const ids = [...new Set([...ids_, id])];
    setModal({ ids, type, open: true });
  };

  const onCloseModal = () => {
    setModal({ ids: undefined, type: undefined, open: false });
  };

  const onDelete = () => {
    if (modal.ids && modal.type && garageData) {
      deleters[modal.type](garageData.id, modal.ids);
    }
    onCloseModal();
  };

  if (!currentUser.token) return <Unauthorized />;
  return (
    <MainLayout
      pageTitle="Edit Garage"
      pageDescription="Edit your garage!"
      urlPath={GARAGE_UPDATE_URL(id)}
    >
      <Box maxW="5xl" w="5xl" display="flex" flexDir={'column'}>
        <chakra.section pt={8}>
          <Flex direction="column" maxW="5xl">
            <Heading size="xl" pb={4}>
              <FormattedMessage {...garageStrings.updateHeading} />
            </Heading>
            <Text fontSize="md">
              <FormattedMessage {...garageStrings.garageKeyInfo} />
            </Text>
            <Heading size="sm" mt={1}>
              <FormattedMessage
                {...garageStrings.garageKey}
                values={{ key: id }}
              />
            </Heading>
          </Flex>
        </chakra.section>
        {garageData && (
          <UpdateGarage
            id={id}
            title={garageData.title}
            description={garageData.description}
            drivers={garageData.drivers}
            image={garageData.image}
          />
        )}
        <Modal onClose={onCloseModal} isOpen={modal.open} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <FormattedMessage
                {...profileStrings.deleteItem}
                values={{
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  item: <FormattedMessage {...commonStrings[modal.type!]} />
                }}
              />
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormattedMessage
                {...garageStrings.deleteItemAreYouSure}
                values={{
                  item: (
                    <span style={{ textTransform: 'lowercase' }}>
                      <FormattedMessage {...commonStrings[modal.type!]} />
                    </span>
                  )
                }}
              />
            </ModalBody>
            <ModalFooter>
              <HStack>
                <Button onClick={onCloseModal}>
                  <FormattedMessage {...commonStrings.cancel} />
                </Button>
                <Button variant={'solid'} colorScheme="red" onClick={onDelete}>
                  <FormattedMessage {...commonStrings.delete} />
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Tabs
          mt={2}
          variant="enclosed"
          isLazy
          defaultIndex={0}
          colorScheme="red"
        >
          <TabList>
            <Tab aria-label={commonStrings.editProfile.defaultMessage}>
              <FormattedMessage {...commonStrings.liveries} />
            </Tab>
            <Tab aria-label={commonStrings.liveries.defaultMessage}>
              <FormattedMessage {...commonStrings.drivers} />
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {/* liveries list */}
              <Table<LiveriesDataType>
                actions={[
                  ({ id }) => (
                    <Button
                      onClick={() =>
                        onOpenModal(id, selectedLiveries, 'liveries')
                      }
                      variant={'outline'}
                      size="sm"
                    >
                      <FormattedMessage {...commonStrings.delete} />
                    </Button>
                  ),
                  ({ id }) => (
                    <a onClick={() => onClickLivery(id)}>
                      <Button variant="solid" size="sm" colorScheme="red">
                        <FormattedMessage {...commonStrings.view} />
                      </Button>
                    </a>
                  )
                ]}
                columns={[
                  {
                    label: <FormattedMessage {...formStrings.title} />,
                    dataKey: 'images',
                    type: TableDataTypes.IMAGE
                  },
                  {
                    label: '',
                    dataKey: 'title',
                    type: TableDataTypes.STRING
                  },
                  {
                    label: <FormattedMessage {...formStrings.creator} />,
                    dataKey: 'creator.displayName',
                    type: TableDataTypes.STRING
                  },
                  {
                    label: <FormattedMessage {...formStrings.car} />,
                    dataKey: 'car',
                    type: TableDataTypes.STRING
                  }
                ]}
                data={
                  liveries?.ids.reduce((prev, id) => {
                    const output = [...prev];
                    const livery = liveries.entities[id];
                    if (livery) output.push(livery);
                    return output;
                  }, [] as LiveriesDataType) || []
                }
                onSelect={toggleSelectedLiveries}
                selected={selectedLiveries}
              />
              <Loader />
            </TabPanel>
            {/* users list */}
            <TabPanel>
              <Table<PublicUserDataType[]>
                actions={[
                  ({ id }) => (
                    <Button
                      variant={'outline'}
                      size="sm"
                      onClick={() =>
                        onOpenModal(id, selectedDrivers, 'drivers')
                      }
                    >
                      <FormattedMessage {...commonStrings.delete} />
                    </Button>
                  ),
                  ({ id }) => (
                    <Link href={PROFILE_URL_BY_ID(`${id}`)} passHref>
                      <Button variant={'solid'} size="sm" colorScheme="red">
                        <FormattedMessage {...commonStrings.view} />
                      </Button>
                    </Link>
                  )
                ]}
                columns={[
                  {
                    label: <FormattedMessage {...formStrings.displayName} />,
                    dataKey: 'displayName',
                    type: TableDataTypes.STRING
                  }
                ]}
                data={
                  users?.ids.reduce((prev, id) => {
                    const output = [...prev];
                    const user = users.entities[id];
                    if (user) output.push(user);
                    return output;
                  }, [] as PublicUserDataType[]) || []
                }
                selected={selectedDrivers}
                onSelect={toggleSelectedDrivers}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </MainLayout>
  );
};

export default Update;

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ params }) => {
      const paramsId = params?.id;
      let id = '';
      if (isString(paramsId)) {
        id = paramsId;
      }

      let garage;
      if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
        garage = await db.cache.getById(CacheKeys.GARAGE, id);
      }
      if (!garage) {
        garage = await db.getGarageById(id);
      }

      const liveries = [] as LiveriesDataType;
      for (const liveryId of garage?.liveries || []) {
        let livery;
        if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
          livery = await db.cache.getById(CacheKeys.LIVERY, liveryId);
        }
        if (!livery) {
          livery = await db.getLiveryById(liveryId);
        }
        if (livery) liveries.push(livery);
      }

      const users = [] as UsersDataType;
      for (const userId of garage?.drivers || []) {
        let user;
        if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
          user = await db.cache.getById(CacheKeys.USER, userId);
        }
        if (!user) {
          user = await db.getUserById(userId);
        }
        if (user) users.push(user);
      }

      if (garage) store.dispatch(garageActions.setGarage(garage));
      if (liveries) store.dispatch(liveryActions.setLiveries(liveries));
      if (users) store.dispatch(userActions.setUsers(users));

      return {
        props: {
          id
        }
      };
    }
);

export const getStaticPaths: GetStaticPaths = async () => {
  let garages;

  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    garages = await db.cache.get(CacheKeys.GARAGE);
  }

  if (!garages) {
    garages = await db.getGarages();
  }

  return {
    paths: garages.map(({ id }) => ({ params: { id } })),
    fallback: 'blocking'
  };
};
