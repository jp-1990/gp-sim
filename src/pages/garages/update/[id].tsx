import React, { useEffect, useState } from 'react';
import { GetStaticPaths, NextPage } from 'next';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';
import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
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

import store, { apiSlice, useAppSelector, wrapper } from '../../../store/store';
import {
  getGarageById,
  getGarages,
  useDeleteLiveryFromGarageMutation,
  useDeleteUserFromGarageMutation,
  useGetGarageByIdQuery
} from '../../../store/garage/api-slice';
import { useGetUsersQuery } from '../../../store/user/api-slice';

import {
  GARAGE_UPDATE_URL,
  LIVERY_URL,
  PROFILE_URL_BY_ID
} from '../../../utils/nav';
import { commonStrings, formStrings, garageStrings } from '../../../utils/intl';
import { isString } from '../../../utils/functions';

import {
  LiveriesDataType,
  PublicUserDataType,
  UserFilterKeys
} from '../../../types';
import { useLiveryFilters } from '../../../hooks/use-livery-filters';
import { useGetLiveriesQuery } from '../../../store/livery/api-slice';
import {
  useDownloadLivery,
  useSelectedLiveries,
  useUserFilters
} from '../../../hooks';
import { useAuthCheck } from '../../../hooks/use-auth-check';
import { Unauthorized } from '../../../components/shared';

interface Props {
  id: string;
}
const Update: NextPage<Props> = ({ id }) => {
  // AUTH CHECK
  const { currentUser } = useAuthCheck();

  // STATE
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);

  // HOOKS
  const { filters: userFilters, setFilters: setUserFilters } = useUserFilters();
  const { filters: liveryFilters, setFilters: setLiveryFilters } =
    useLiveryFilters();

  const { data: garageData } = useGetGarageByIdQuery(id);
  const { data: userData } = useGetUsersQuery(userFilters);
  const { data: liveriesData } = useGetLiveriesQuery(liveryFilters);
  const { toggle: toggleSelectedLiveries, selected: selectedLiveries } =
    useSelectedLiveries();
  const [deleteLivery] = useDeleteLiveryFromGarageMutation();
  const [deleteDriver] = useDeleteUserFromGarageMutation();
  const { onDownload } = useDownloadLivery();

  useEffect(() => {
    if (garageData?.drivers) {
      setUserFilters({
        key: UserFilterKeys.IDS,
        value: garageData?.drivers.join('&')
      });
    }
  }, [garageData?.drivers, setUserFilters]);

  useEffect(() => {
    if (garageData?.liveries) {
      setLiveryFilters({
        key: UserFilterKeys.IDS,
        value: garageData?.liveries.join('&')
      });
    }
  }, [garageData?.liveries, setLiveryFilters]);

  const toggleSelectedDrivers = (id: string | string[]) => {
    if (typeof id === 'object') return setSelectedDrivers(id);
    setSelectedDrivers((prev) => {
      if (prev.includes(id)) return prev.filter((prevId) => id !== prevId);
      return [...prev, id];
    });
  };

  const disableDownload = (liveryId: string | number) =>
    !currentUser?.data?.liveries.find((id) => `${liveryId}` === id);

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
                    <Link href={LIVERY_URL(`${id}`)} passHref>
                      <Button variant={'outline'} size="sm" colorScheme="red">
                        <FormattedMessage {...commonStrings.view} />
                      </Button>
                    </Link>
                  ),
                  ({ id }) => (
                    <Button
                      disabled={disableDownload(id)}
                      onClick={onDownload({
                        selectedLiveries,
                        currentUser,
                        liveries: liveriesData,
                        targetLiveryId: id
                      })}
                      variant={'solid'}
                      size="sm"
                      colorScheme="red"
                    >
                      <FormattedMessage {...commonStrings.download} />
                    </Button>
                  ),
                  ({ id }) => (
                    <Button
                      onClick={() => deleteLivery(id)}
                      variant={'ghost'}
                      size="sm"
                      colorScheme="red"
                    >
                      <FormattedMessage {...commonStrings.delete} />
                    </Button>
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
                  liveriesData?.ids.reduce((prev, id) => {
                    const output = [...prev];
                    const livery = liveriesData.entities[id];
                    if (livery) output.push(livery);
                    return output;
                  }, [] as LiveriesDataType) || []
                }
                onSelect={toggleSelectedLiveries}
                selected={selectedLiveries}
              />
            </TabPanel>
            {/* users list */}
            <TabPanel>
              <Table<PublicUserDataType[]>
                actions={[
                  ({ id }) => (
                    <Link href={PROFILE_URL_BY_ID(`${id}`)} passHref>
                      <Button variant={'solid'} size="sm" colorScheme="red">
                        <FormattedMessage {...commonStrings.view} />
                      </Button>
                    </Link>
                  ),
                  ({ id }) => (
                    <Button
                      variant={'ghost'}
                      size="sm"
                      onClick={() => deleteDriver(id)}
                      colorScheme="red"
                    >
                      <FormattedMessage {...commonStrings.delete} />
                    </Button>
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
