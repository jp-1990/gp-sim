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

import store, {
  apiSlice,
  useAppDispatch,
  useAppSelector,
  wrapper
} from '../../../store/store';
import { getGarageById, getGarages } from '../../../store/garage/api-slice';
import { useGetUsersQuery } from '../../../store/user/api-slice';
import {
  activatePage,
  createSelectScrollY,
  FilterActionPayload,
  filtersChanged,
  lastLiveryChanged,
  scrollYChanged,
  selectedLiveriesChanged,
  selectFilters,
  selectLastLiveryId,
  selectLiveryEntities,
  selectLiveryIds,
  selectSelectedLiveries,
  thunks as liveryScrollThunks
} from '../../../store/livery/scroll-slice';

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
  UserFilterKeys
} from '../../../types';
import {
  useInfiniteScroll,
  useUserFilters,
  useAuthCheck
} from '../../../hooks';
import { Unauthorized } from '../../../components/shared';
import {
  thunks as garageThunks,
  selectors as garageSelectors,
  thunks
} from '../../../store/garage/slice';

interface Props {
  id: string;
}
const Update: NextPage<Props> = ({ id }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(activatePage(GARAGES_URL_ID));
    dispatch(garageThunks.getGarageById({ id }));
    return () => {
      dispatch(activatePage(null));
    };
  }, [dispatch, id]);

  // AUTH CHECK
  const { currentUser } = useAuthCheck();

  // STATE
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [modal, setModal] = useState({
    ids: undefined as string[] | undefined,
    type: undefined as 'drivers' | 'liveries' | undefined,
    open: false
  });

  // HOOKS
  const filters = useAppSelector(selectFilters);
  const lastLiveryId = useAppSelector(selectLastLiveryId);
  const scrollY = useAppSelector(createSelectScrollY(GARAGES_URL_ID));
  const selectedLiveries = useAppSelector(selectSelectedLiveries);
  const garageData = useAppSelector(garageSelectors.createSelectGarageById(id));

  const liveries = {
    ids: useAppSelector(selectLiveryIds),
    entities: useAppSelector(selectLiveryEntities)
  };

  const { Loader } = useInfiniteScroll(lastLiveryChanged, liveries);

  const { filters: userFilters, setFilters: setUserFilters } = useUserFilters();

  const { data: userData } = useGetUsersQuery(userFilters);

  const deleters = {
    liveries: async (id: string, ids: string[]) =>
      dispatch(thunks.updateGarageByIdLiveries({ id, liveriesToRemove: ids })),
    drivers: async (id: string, ids: string[]) =>
      dispatch(thunks.updateGarageByIdUsers({ id, usersToRemove: ids }))
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
      dispatch(liveryScrollThunks.getLiveries({ ...filters, lastLiveryId }));
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
    dispatch(filtersChanged(payload));

  const toggleSelectedLiveries = (payload: string | string[]) =>
    dispatch(selectedLiveriesChanged(payload));

  const onClickLivery = (id: string) => {
    dispatch(scrollYChanged(window.scrollY));
    router.push(LIVERY_URL(id));
  };

  const onOpenModal = (ids: string[], type: 'drivers' | 'liveries') => {
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
                  () => (
                    <Button
                      onClick={() => onOpenModal(selectedLiveries, 'liveries')}
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
                  () => (
                    <Button
                      variant={'outline'}
                      size="sm"
                      onClick={() => onOpenModal(selectedDrivers, 'drivers')}
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
                  userData?.ids.reduce((prev, id) => {
                    const output = [...prev];
                    const user = userData.entities[id];
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
        store.dispatch(getGarageById.initiate(id));
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
  const { data } = await store.dispatch(getGarages.initiate({}));
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
