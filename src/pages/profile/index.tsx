/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Button,
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
import { getCars } from '../../lib/car';
import { actions as carActions } from '../../store/car/slice';
import {
  selectors as garageSelectors,
  thunks as garageThunks
} from '../../store/garage/slice';
import {
  FilterActionPayload,
  actions as liveryActions,
  selectors as liverySelectors,
  thunks as liveryThunks
} from '../../store/livery/slice';
import { useAppDispatch, useAppSelector, wrapper } from '../../store/store';

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
    dispatch(liveryActions.activatePage(PROFILE_URL));
    dispatch(garageThunks.getGarages());
    return () => {
      dispatch(liveryActions.activatePage(null));
    };
  }, [dispatch]);

  // AUTH CHECK
  const { currentUser } = useAuthCheck();

  // STATE
  const [tabIndex, setTabIndex] = useState(0);
  const [modal, setModal] = useState({
    id: undefined as string | undefined,
    type: undefined as 'garage' | 'livery' | undefined,
    open: false
  });

  // HOOKS
  const filters = useAppSelector(liverySelectors.selectFilters);
  const lastLiveryId = useAppSelector(liverySelectors.selectLastLiveryId);
  const scrollY = useAppSelector(
    liverySelectors.createSelectScrollY(PROFILE_URL)
  );

  const liveries = {
    ids: useAppSelector(liverySelectors.selectLiveryIds),
    entities: useAppSelector(liverySelectors.selectLiveryEntities)
  };

  const { Loader } = useInfiniteScroll(() => {
    if (!currentUser.token) return;
    dispatch(liveryThunks.getLiveries({ ...filters, lastLiveryId }));
  }, liveries);

  const garages = {
    ids: useAppSelector(garageSelectors.selectGarageIds),
    entities: useAppSelector(garageSelectors.selectGarageEntities)
  };

  const deletions = {
    garage: (id: string) => dispatch(garageThunks.deleteGarageById({ id })),
    livery: (id: string) => dispatch(liveryThunks.deleteLiveryById({ id }))
  };

  useEffect(() => {
    const tab = router.asPath.split('tab=')[1];
    if (currentUser.token && +tab === tabIndex && scrollY) {
      window.scrollTo({
        top: scrollY,
        behavior: 'auto'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, router.asPath, scrollY, tabIndex]);

  useEffect(() => {
    const tab = router.asPath.split('tab=')[1];
    if (currentUser.token && !isNaN(+tab) && +tab !== tabIndex)
      setTabIndex(+tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, router.asPath]);

  // HANDLERS
  const setFilters = (payload: FilterActionPayload) =>
    dispatch(liveryActions.filtersChanged(payload));

  const onClickLivery = (id: string) => {
    dispatch(liveryActions.scrollYChanged(window.scrollY));
    router.push(LIVERY_URL(id));
  };

  const onTabsChange = (index: number) => {
    router.push(PROFILE_URL, { query: { tab: `${index}` } });
    setTabIndex(index);
  };

  const onOpenModal = (id: string, type: 'garage' | 'livery') => {
    setModal({ id, type, open: true });
  };

  const onCloseModal = () => {
    setModal({ id: undefined, type: undefined, open: false });
  };

  const onDelete = () => {
    if (modal.id && modal.type) deletions[modal.type](modal.id);
    onCloseModal();
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
      <Modal onClose={onCloseModal} isOpen={modal.open} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <FormattedMessage
              {...profileStrings.deleteItem}
              values={{
                item: <FormattedMessage {...commonStrings[modal.type!]} />
              }}
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormattedMessage
              {...profileStrings.deleteItemAreYouSure}
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
                      onClick={() => onOpenModal(id, 'livery')}
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
              <Loader />
            </TabPanel>
            {/* garages list */}
            <TabPanel>
              <Table<GaragesDataType>
                actions={[
                  ({ id }) => (
                    <Button
                      variant={'outline'}
                      size="sm"
                      onClick={() => onOpenModal(id, 'garage')}
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
      </Flex>
    </MainLayout>
  );
};

export default Profile;

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  const cars = await getCars();
  store.dispatch(carActions.setCars(cars));

  return {
    props: {}
  };
});
