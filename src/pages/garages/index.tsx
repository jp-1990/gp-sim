import { useEffect } from 'react';
import { chakra, Box, Button, Flex, Text, Heading } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';

import { useAppDispatch, useAppSelector, wrapper } from '../../store/store';
import { actions as carActions } from '../../store/car/slice';
import {
  FilterActionPayload,
  actions as liveryActions,
  selectors as liverySelectors,
  thunks as liveryThunks
} from '../../store/livery/slice';
import {
  actions as garageActions,
  selectors as garageSelectors,
  thunks as garageThunks
} from '../../store/garage/slice';

import { MainLayout } from '../../components/layout';
import {
  PageHeading,
  Unauthorized,
  Table,
  TableDataTypes
} from '../../components/shared';
import { ImageWithFallback } from '../../components/core';
import { LiveryFilter, Mode } from '../../components/features';

import { GARAGES_URL, GARAGE_CREATE_URL, LIVERY_URL } from '../../utils/nav';
import { garageStrings, commonStrings, formStrings } from '../../utils/intl';

import { LiveriesDataType } from '../../types';
import {
  useAuthCheck,
  useDownloadLivery,
  useInfiniteScroll
} from '../../hooks';
import db, { CacheKeys } from '../../lib';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';

const Garages: NextPage = () => {
  // AUTH CHECK
  const { currentUser } = useAuthCheck();

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentUser.token) {
      dispatch(liveryActions.activatePage(GARAGES_URL));
      dispatch(garageThunks.getGarages());
    }
    return () => {
      dispatch(liveryActions.activatePage(null));
    };
  }, [currentUser.token, dispatch]);

  // HOOKS
  const filters = useAppSelector(liverySelectors.selectFilters);
  const lastLiveryId = useAppSelector(liverySelectors.selectLastLiveryId);
  const scrollY = useAppSelector(
    liverySelectors.createSelectScrollY(GARAGES_URL)
  );
  const selectedGarage = useAppSelector(liverySelectors.selectSelectedGarage);
  const selectedLiveries = useAppSelector(
    liverySelectors.selectSelectedLiveries
  );

  const garages = {
    ids: useAppSelector(garageSelectors.selectGarageIds),
    entities: useAppSelector(garageSelectors.selectGarageEntities)
  };
  const liveries = {
    ids: useAppSelector(liverySelectors.selectLiveryIds),
    entities: useAppSelector(liverySelectors.selectLiveryEntities)
  };

  const { Loader } = useInfiniteScroll(() => {
    if (!currentUser.token || !currentUser.data?.liveries) return;
    dispatch(liveryThunks.getLiveries({ ...filters, lastLiveryId }));
  }, liveries);

  const { onDownload } = useDownloadLivery();

  // EFFECTS
  useEffect(() => {
    if (
      selectedGarage === 'NULL' &&
      currentUser.token &&
      currentUser.data?.liveries
    )
      onSelectGarage(null)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.data?.liveries]);

  useEffect(() => {
    if (scrollY && currentUser.token)
      window.scrollTo({
        top: scrollY,
        behavior: 'auto'
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollY]);

  // HANDLERS
  const setFilters = (payload: FilterActionPayload) =>
    dispatch(liveryActions.filtersChanged(payload));

  const toggleSelectedLiveries = (payload: string | string[]) =>
    dispatch(liveryActions.selectedLiveriesChanged(payload));

  const onClickLivery = (id: string) => {
    dispatch(liveryActions.scrollYChanged(window.scrollY));
    router.push(LIVERY_URL(id));
  };

  const onSelectGarage = (id: string | null | undefined) => () => {
    if (id !== selectedGarage) {
      dispatch(liveryActions.selectedGarageChanged(id ?? null));
      if (id === null) {
        setFilters({
          key: 'ids',
          value: currentUser.data?.liveries.join('&') ?? ''
        });
      }
      if (typeof id === 'string') {
        const garageLiveriesIds = garages?.entities[id]?.liveries;

        setFilters({
          key: 'ids',
          value: garageLiveriesIds?.length
            ? garageLiveriesIds.join('&')
            : 'null'
        });
      }
    }
  };

  const highlightedColor = 'red.500';
  const disableDownload = (liveryId: string | number) =>
    !currentUser.data?.liveries.find((id) => `${liveryId}` === id);

  if (!currentUser.token) return <Unauthorized />;
  return (
    <MainLayout
      pageTitle="Garages"
      pageDescription="View your collection of liveries, sorted by garage."
      urlPath={GARAGES_URL}
    >
      <PageHeading
        heading={<FormattedMessage {...garageStrings.garagesHeading} />}
        paragraph={<FormattedMessage {...garageStrings.garagesSummary} />}
      />
      <Flex w="full" maxW="5xl" my={5}>
        <Button colorScheme="red" w="3xs" lineHeight={1}>
          <Link href={GARAGE_CREATE_URL}>
            <a>
              <FormattedMessage {...garageStrings.createAGarage} />
            </a>
          </Link>
        </Button>
      </Flex>

      {/* garage list */}
      {garages && (
        <chakra.section
          pt={8}
          w="5xl"
          display="flex"
          justifyContent="flex-start"
          overflow="auto"
        >
          <Box
            as="button"
            onClick={onSelectGarage(null)}
            key="userCollection"
            mb={2}
            mx={0.5}
            p={2}
            position="relative"
            borderWidth="2px"
            borderRadius={6}
            borderColor={
              selectedGarage === null ? highlightedColor : 'blackAlpha.100'
            }
            overflow="hidden"
            h="240px"
            minW="240px"
          >
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="flex-start"
              h="full"
              maxW="15rem"
              overflow="hidden"
              position="relative"
              zIndex={1}
            >
              <Text
                color={'white'}
                borderRadius={5}
                px={2}
                bg={
                  selectedGarage === null ? highlightedColor : 'blackAlpha.800'
                }
                fontSize="sm"
                noOfLines={1}
                w="full"
                textAlign="center"
              >
                <FormattedMessage {...garageStrings.yourCollection} />
              </Text>
            </Flex>
            <ImageWithFallback
              imgAlt="user livery collection"
              imgUrl={''}
              position="absolute"
              top="0"
              left="0"
              zIndex="0"
              bg="gray.200"
              h="full"
              w="full"
              borderRadius={3}
            />
          </Box>
          {garages.ids.map((id) => (
            <Box
              as="button"
              display="flex"
              flexDir="column"
              onClick={onSelectGarage(garages.entities[id]?.id)}
              key={id}
              mb={2}
              mx={0.5}
              p={2}
              position="relative"
              borderWidth="2px"
              borderRadius={6}
              borderColor={
                id === selectedGarage ? highlightedColor : 'blackAlpha.100'
              }
              overflow="hidden"
              h="240px"
              minW="240px"
            >
              <Flex
                direction="column"
                alignItems="center"
                justifyContent="flex-start"
                position="relative"
                zIndex={1}
                w="full"
                overflow="hidden"
              >
                <Text
                  color={'white'}
                  borderRadius={5}
                  px={2}
                  bg={
                    id === selectedGarage ? highlightedColor : 'blackAlpha.800'
                  }
                  fontSize="sm"
                  noOfLines={1}
                  textAlign="center"
                  w="full"
                >
                  {garages.entities[id]?.title}
                </Text>
              </Flex>
              <Flex flex={1} />
              <Flex
                direction="column"
                alignItems="flex-start"
                justifyContent="flex-end"
                maxW="15rem"
                position="relative"
                zIndex={1}
                overflow="hidden"
              >
                <Text
                  color={'white'}
                  borderRadius={5}
                  px={2}
                  bg={
                    id === selectedGarage ? highlightedColor : 'blackAlpha.800'
                  }
                  fontSize="sm"
                  noOfLines={1}
                >
                  {garages.entities[id]?.creator.displayName}
                </Text>
              </Flex>
              <ImageWithFallback
                imgAlt={garages.entities[id]?.title}
                imgUrl={garages.entities[id]?.image}
                position="absolute"
                top="0"
                left="0"
                zIndex="0"
                bg="gray.200"
                h="full"
                w="full"
                borderRadius={3}
              />
            </Box>
          ))}
        </chakra.section>
      )}

      {/* selected garage info */}
      <chakra.section
        w="5xl"
        pt={8}
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Heading size="md" pb={4}>
          {garages?.entities[selectedGarage ?? '']?.title ?? (
            <FormattedMessage {...garageStrings.yourCollection} />
          )}
        </Heading>
        <Text fontSize="sm" pb={4}>
          {garages?.entities[selectedGarage ?? '']?.description ?? (
            <FormattedMessage {...garageStrings.yourCollectionDescription} />
          )}
        </Text>
      </chakra.section>

      {/* search and filter */}
      <LiveryFilter
        mode={Mode.BASIC}
        filters={filters}
        setFilters={setFilters}
      />

      {/* liveries list */}
      <Table<LiveriesDataType>
        actions={[
          ({ id }) => (
            <a onClick={() => onClickLivery(id)}>
              <Button variant={'outline'} size="sm" colorScheme="red">
                <FormattedMessage {...commonStrings.view} />
              </Button>
            </a>
          ),
          ({ id }) => (
            <Button
              disabled={disableDownload(id)}
              onClick={onDownload({
                selectedLiveries,
                targetLiveryId: id
              })}
              variant={'solid'}
              size="sm"
              colorScheme="red"
            >
              <FormattedMessage {...commonStrings.download} />
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
    </MainLayout>
  );
};

export default Garages;

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  let cars;
  let garages;
  let liveries;

  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    liveries = await db.cache.get(CacheKeys.LIVERY);
    cars = await db.cache.get(CacheKeys.CAR);
    garages = await db.cache.get(CacheKeys.GARAGE);
  }

  if (!cars) {
    cars = await db.getCars();
  }
  if (!garages) {
    garages = await db.getGarages();
  }
  if (!liveries) {
    liveries = await db.getLiveries();
  }

  if (cars) store.dispatch(carActions.setCars(cars));
  if (garages) store.dispatch(garageActions.setGarages(garages));
  if (liveries) store.dispatch(liveryActions.setLiveries(liveries));

  return {
    props: {}
  };
});
