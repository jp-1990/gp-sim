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
import LiveryFilter, {
  Mode
} from '../../components/features/liveries/LiveryFilter/LiveryFilter';
import UpdateProfile from '../../components/features/profie/UpdateProfile/UpdateProfile';
import { MainLayout } from '../../components/layout';
import { Form, PageHeading } from '../../components/shared';
import { Table } from '../../components/shared/Table/Table';
import { TableDataTypes } from '../../components/shared/Table/types';
import { useGarageFilters } from '../../hooks/use-garage-filters';
import { useLiveryFilters } from '../../hooks/use-livery-filters';
import {
  useDeleteGarageMutation,
  useGetGaragesQuery
} from '../../store/garage/api-slice';
import {
  useDeleteLiveryMutation,
  useGetLiveriesQuery
} from '../../store/livery/api-slice';
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

  const { data: liveries } = useGetLiveriesQuery(liveryFilters);
  const { data: garages } = useGetGaragesQuery(garageFilters);
  const [deleteLivery] = useDeleteLiveryMutation();
  const [deleteGarage] = useDeleteGarageMutation();

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

  const liveryPages = Array.from(
    Array(Math.ceil((liveries?.total || 1) / (liveries?.perPage || 1))).keys()
  );
  const garagePages = Array.from(
    Array(Math.ceil((garages?.total || 1) / (garages?.perPage || 1))).keys()
  );

  const onLiveryPageChange = (page: number) => () => {
    setLiveryFilters({ key: LiveriesFilterKeys.PAGE, value: page });
  };

  const onGaragePageChange = (page: number) => () => {
    setGarageFilters({ key: GaragesFilterKeys.PAGE, value: page });
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
            <Tab aria-label={commonStrings.editProfile.defaultMessage}>
              <FormattedMessage {...commonStrings.editProfile} />
            </Tab>
            <Tab aria-label={commonStrings.liveries.defaultMessage}>
              <FormattedMessage {...commonStrings.liveries} />
            </Tab>
            <Tab aria-label={commonStrings.garages.defaultMessage}>
              <FormattedMessage {...commonStrings.garages} />
            </Tab>
          </TabList>
          <TabPanels>
            {/* edit profile */}
            <TabPanel mt={4}>
              <Heading size="sm" pb={4}>
                <FormattedMessage {...garageStrings.yourCollection} />
              </Heading>
              <Form>
                <UpdateProfile
                  about={currentUser.about}
                  displayName={currentUser.displayName}
                  email={currentUser.email}
                  forename={currentUser.forename}
                  surname={currentUser.surname}
                />
              </Form>
            </TabPanel>
            {/* liveries list */}
            <TabPanel>
              <LiveryFilter
                pt={2}
                mode={Mode.BASIC}
                filters={liveryFilters}
                setFilters={setLiveryFilters}
              />
              <Table<LiveriesDataType>
                actions={[
                  ({ id }) => (
                    <Button
                      variant={'outline'}
                      size="sm"
                      onClick={() => deleteLivery(id)}
                    >
                      <FormattedMessage {...commonStrings.delete} />
                    </Button>
                  ),
                  ({ id }) => (
                    <Link href={LIVERY_URL(`${id}`)} passHref>
                      <Button variant={'solid'} size="sm" colorScheme="red">
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
                    label: (
                      <FormattedMessage {...commonStrings.downloadsLabel} />
                    ),
                    dataKey: 'downloads',
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
            {/* garages list */}
            <TabPanel>
              <Table<GaragesDataType>
                actions={[
                  ({ id }) => (
                    <Button
                      variant={'outline'}
                      size="sm"
                      onClick={() => deleteGarage(id)}
                    >
                      <FormattedMessage {...commonStrings.delete} />
                    </Button>
                  ),
                  ({ id }) => (
                    <Link href={GARAGE_URL(`${id}`)} passHref>
                      <Button variant={'solid'} size="sm" colorScheme="red">
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
                          onClick={onGaragePageChange(page)}
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
