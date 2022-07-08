import {
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from '@chakra-ui/react';
import { NextPage } from 'next';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import UpdateProfile from '../../components/features/profie/UpdateProfile/UpdateProfile';
import { MainLayout } from '../../components/layout';
import { PageHeading } from '../../components/shared';
import { Table } from '../../components/shared/Table/Table';
import { TableDataTypes } from '../../components/shared/Table/types';
import { useGarageFilters } from '../../hooks/use-garage-filters';
import { useLiveryFilters } from '../../hooks/use-livery-filters';
import { useGetGaragesQuery } from '../../store/garage/api-slice';
import { useGetLiveriesQuery } from '../../store/livery/api-slice';
import { useAppSelector } from '../../store/store';
import {
  GaragesDataType,
  GaragesFilterKeys,
  LiveriesDataType,
  LiveriesFilterKeys
} from '../../types';
import {
  commonStrings,
  formStrings,
  garageStrings,
  profileStrings
} from '../../utils/intl';
import { GARAGE_URL, LIVERY_URL, PROFILE_URL } from '../../utils/nav';

const Profile: NextPage = () => {
  const { filters: liveryFilters, setFilters: setLiveryFilters } =
    useLiveryFilters();
  const { filters: garageFilters, setFilters: setGarageFilters } =
    useGarageFilters();

  const currentUser = useAppSelector((state) => state.currentUserSlice);

  useEffect(() => {
    setLiveryFilters({
      key: LiveriesFilterKeys.USER,
      value: currentUser.id
    });
  }, [currentUser, setLiveryFilters]);
  useEffect(() => {
    setGarageFilters({
      key: GaragesFilterKeys.USER,
      value: currentUser.id
    });
  }, [currentUser, setGarageFilters]);

  const { data: liveries } = useGetLiveriesQuery(liveryFilters);
  const { data: garages } = useGetGaragesQuery(garageFilters);

  const liveryPages = Array.from(
    Array(Math.ceil((liveries?.total || 1) / (liveries?.perPage || 1))).keys()
  );
  const garagePages = Array.from(
    Array(Math.ceil((garages?.total || 1) / (garages?.perPage || 1))).keys()
  );

  const onLiveryPageChange = (page: number) => () => {
    setLiveryFilters({ key: LiveriesFilterKeys.PAGE, value: page });
  };

  return (
    <MainLayout
      pageTitle="Profile"
      pageDescription="User profile home screen."
      urlPath={PROFILE_URL}
    >
      <PageHeading
        heading={<FormattedMessage {...profileStrings.profileHeading} />}
        paragraph={<FormattedMessage {...profileStrings.profileSummary} />}
      />
      <Flex w="full" maxW="5xl" my={5}>
        <Tabs variant="enclosed" isLazy defaultIndex={0} colorScheme="red">
          <TabList>
            <Tab aria-label={commonStrings.profile.defaultMessage}>
              <FormattedMessage {...commonStrings.profile} />
            </Tab>
            <Tab aria-label={commonStrings.liveries.defaultMessage}>
              <FormattedMessage {...commonStrings.liveries} />
            </Tab>
            <Tab aria-label={commonStrings.garages.defaultMessage}>
              <FormattedMessage {...commonStrings.garages} />
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel mt={4}>
              <Heading size="sm" pb={4}>
                <FormattedMessage {...garageStrings.yourCollection} />
              </Heading>
              <UpdateProfile />
            </TabPanel>
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
              />
              {liveryPages.length > 1 && (
                <Flex w="5xl" justifyContent="flex-end">
                  <Flex mt={4}>
                    {liveryPages.map((page) => {
                      return (
                        <Button
                          mx={1}
                          border="1px solid #c4c4c4"
                          key={page + 1}
                          colorScheme={
                            (liveries?.page || 0) === page ? 'red' : undefined
                          }
                          lineHeight={1}
                          onClick={onLiveryPageChange(page)}
                        >
                          {page + 1}
                        </Button>
                      );
                    })}
                  </Flex>
                </Flex>
              )}
            </TabPanel>
            <TabPanel>
              {/* garages list */}
              <Table<GaragesDataType>
                actions={[
                  ({ id }) => (
                    <Link href={GARAGE_URL(`${id}`)} passHref>
                      <Button variant={'outline'} size="sm" colorScheme="red">
                        <FormattedMessage {...commonStrings.view} />
                      </Button>
                    </Link>
                  )
                ]}
                columns={[
                  {
                    label: <FormattedMessage {...formStrings.title} />,
                    dataKey: 'image',
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
                  garages?.ids.reduce((prev, id) => {
                    const output = [...prev];
                    const garage = garages?.entities[id];
                    if (garage) output.push(garage);
                    return output;
                  }, [] as GaragesDataType) || []
                }
              />
              {garagePages.length > 1 && (
                <Flex w="5xl" justifyContent="flex-end">
                  <Flex mt={4}>
                    {garagePages.map((page) => {
                      return (
                        <Button
                          mx={1}
                          border="1px solid #c4c4c4"
                          key={page + 1}
                          colorScheme={
                            (liveries?.page || 0) === page ? 'red' : undefined
                          }
                          lineHeight={1}
                          onClick={onLiveryPageChange(page)}
                        >
                          {page + 1}
                        </Button>
                      );
                    })}
                  </Flex>
                </Flex>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </MainLayout>
  );
};

export default Profile;