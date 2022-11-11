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
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { LiveryFilter, Mode, UpdateProfile } from '../../components/features';
import { MainLayout } from '../../components/layout';
import {
  Form,
  PageHeading,
  Unauthorized,
  Table,
  TableDataTypes
} from '../../components/shared';

import { useAuthCheck, useInfiniteScroll } from '../../hooks';
import {
  useDeleteGarageMutation,
  useDeleteLiveriesFromGarageMutation,
  useGetGaragesQuery
} from '../../store/garage/api-slice';
import { useGetLiveriesQuery } from '../../store/livery/api-slice';
import {
  activatePage,
  FilterActionPayload,
  filtersChanged,
  lastLiveryChanged,
  scrollYChanged,
  selectFilters,
  selectLastLiveryId,
  selectLiveryEntities,
  selectLiveryIds,
  selectScrollY
} from '../../store/livery/scroll-slice';
import { useAppDispatch, useAppSelector } from '../../store/store';

import { GaragesDataType, LiveriesDataType } from '../../types';
import {
  commonStrings,
  formStrings,
  garageStrings,
  profileStrings
} from '../../utils/intl';
import { GARAGE_UPDATE_URL, LIVERY_URL, PROFILE_URL } from '../../utils/nav';

const Profile: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(activatePage(PROFILE_URL));
    return () => {
      dispatch(activatePage(null));
    };
  }, [dispatch]);

  // AUTH CHECK
  const { currentUser } = useAuthCheck();

  // STATE
  const [tabIndex, setTabIndex] = useState(0);

  // HOOKS
  const filters = useAppSelector(selectFilters);
  const lastLiveryId = useAppSelector(selectLastLiveryId);
  const scrollY = useAppSelector(selectScrollY);

  const liveries = {
    ids: useAppSelector(selectLiveryIds),
    entities: useAppSelector(selectLiveryEntities)
  };

  const { Loader } = useInfiniteScroll(lastLiveryChanged, liveries);

  // QUERIES
  useGetLiveriesQuery(
    {
      ...filters,
      lastLiveryId,
      user: currentUser.data?.id || ''
    },
    { refetchOnMountOrArgChange: true }
  );
  const { data: garages } = useGetGaragesQuery({});
  const [deleteLivery] = useDeleteLiveriesFromGarageMutation();
  const [deleteGarage] = useDeleteGarageMutation();

  useEffect(() => {
    const tab = router.asPath.split('tab=')[1];
    if (+tab === tabIndex && scrollY) {
      window.scrollTo({
        top: scrollY,
        behavior: 'auto'
      });
    }
  }, [router.asPath, scrollY, tabIndex]);

  useEffect(() => {
    const tab = router.asPath.split('tab=')[1];
    if (!isNaN(+tab) && +tab !== tabIndex) setTabIndex(+tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  // HANDLERS
  const setFilters = (payload: FilterActionPayload) =>
    dispatch(filtersChanged(payload));

  const onClickLivery = (id: string) => {
    dispatch(scrollYChanged(window.scrollY));
    router.push(LIVERY_URL(id));
  };

  const onTabsChange = (index: number) => {
    router.push(PROFILE_URL, { query: { tab: `${index}` } });
    setTabIndex(index);
  };

  if (!currentUser.token) return <Unauthorized />;
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
        <Tabs
          variant="enclosed"
          isLazy
          defaultIndex={0}
          colorScheme="red"
          index={tabIndex}
          onChange={onTabsChange}
        >
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
                  about={currentUser?.data?.about}
                  displayName={currentUser?.data?.displayName || ''}
                  email={currentUser?.data?.email || ''}
                  forename={currentUser?.data?.forename || ''}
                  surname={currentUser?.data?.surname || ''}
                />
              </Form>
            </TabPanel>
            {/* liveries list */}
            <TabPanel>
              <LiveryFilter
                pt={2}
                mode={Mode.BASIC}
                filters={filters}
                setFilters={setFilters}
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
                    <a onClick={() => onClickLivery(id)}>
                      <Button variant={'solid'} size="sm" colorScheme="red">
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
                    <Link href={GARAGE_UPDATE_URL(`${id}`)} passHref>
                      <Button variant={'solid'} size="sm" colorScheme="red">
                        <FormattedMessage {...commonStrings.edit} />
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
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Loader />
      </Flex>
    </MainLayout>
  );
};

export default Profile;
