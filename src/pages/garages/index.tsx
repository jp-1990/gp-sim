import { useEffect } from 'react';
import {
  chakra,
  Box,
  Grid,
  GridItem,
  Button,
  Flex,
  Text,
  Heading
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';

import {
  apiSlice,
  useAppDispatch,
  useAppSelector,
  wrapper
} from '../../store/store';
import { getCars } from '../../store/car/api-slice';
import { useGetGaragesQuery } from '../../store/garage/api-slice';
import {
  activatePage,
  FilterActionPayload,
  filtersChanged,
  lastLiveryChanged,
  scrollYChanged,
  selectedGarageChanged,
  selectedLiveriesChanged,
  selectFilters,
  selectLastLiveryId,
  selectLiveryEntities,
  selectLiveryIds,
  createSelectScrollY,
  selectSelectedGarage,
  selectSelectedLiveries,
  thunks
} from '../../store/livery/scroll-slice';

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

const Garages: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(activatePage(GARAGES_URL));
    return () => {
      dispatch(activatePage(null));
    };
  }, [dispatch]);

  // AUTH CHECK
  const { currentUser } = useAuthCheck();

  // HOOKS
  const filters = useAppSelector(selectFilters);
  const lastLiveryId = useAppSelector(selectLastLiveryId);
  const scrollY = useAppSelector(createSelectScrollY(GARAGES_URL));
  const selectedGarage = useAppSelector(selectSelectedGarage);
  const selectedLiveries = useAppSelector(selectSelectedLiveries);

  const liveries = {
    ids: useAppSelector(selectLiveryIds),
    entities: useAppSelector(selectLiveryEntities)
  };

  const { Loader } = useInfiniteScroll(lastLiveryChanged, liveries);

  const { onDownload } = useDownloadLivery();

  // QUERIES
  const { data: garages } = useGetGaragesQuery({});

  useEffect(() => {
    if (selectedGarage === 'NULL' && currentUser.token) onSelectGarage(null)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (currentUser.token) {
      dispatch(thunks.getLiveries({ ...filters, lastLiveryId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, lastLiveryId]);

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
    dispatch(filtersChanged(payload));

  const toggleSelectedLiveries = (payload: string | string[]) =>
    dispatch(selectedLiveriesChanged(payload));

  const onClickLivery = (id: string) => {
    dispatch(scrollYChanged(window.scrollY));
    router.push(LIVERY_URL(id));
  };

  const onSelectGarage = (id: string | null | undefined) => () => {
    if (id !== selectedGarage) {
      dispatch(selectedGarageChanged(id ?? null));
      if (id === null) {
        setFilters({
          key: 'ids',
          value: currentUser.data?.liveries.join('&') ?? ''
        });
      }
      if (typeof id === 'string') {
        setFilters({
          key: 'ids',
          value: garages?.entities[id]?.liveries.join('&') ?? ''
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
            position="relative"
            borderWidth="2px"
            borderRadius={6}
            borderColor={
              selectedGarage === null ? highlightedColor : 'blackAlpha.100'
            }
            overflow="hidden"
            minW="3xs"
          >
            <Grid
              templateColumns="repeat(6, 1fr)"
              templateRows="repeat(2, minmax(5rem, auto))"
              p={2}
              zIndex="1"
              position="relative"
              top="0"
              left="0"
            >
              <GridItem colSpan={6} rowSpan={1}>
                <Flex
                  direction="column"
                  alignItems="center"
                  justifyContent="flex-start"
                  h="full"
                  maxW="15rem"
                  overflow="hidden"
                >
                  <Text
                    color={'white'}
                    borderRadius={5}
                    px={2}
                    bg={
                      selectedGarage === null
                        ? highlightedColor
                        : 'blackAlpha.800'
                    }
                    fontSize="sm"
                    noOfLines={1}
                    w="full"
                    textAlign="center"
                  >
                    <FormattedMessage {...garageStrings.yourCollection} />
                  </Text>
                </Flex>
              </GridItem>
              <GridItem colSpan={6} rowSpan={1}></GridItem>
            </Grid>
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
              onClick={onSelectGarage(garages.entities[id]?.id)}
              key={id}
              mb={2}
              mx={0.5}
              position="relative"
              borderWidth="2px"
              borderRadius={6}
              borderColor={
                id === selectedGarage ? highlightedColor : 'blackAlpha.100'
              }
              overflow="hidden"
              minW="3xs"
            >
              <Grid
                templateColumns="repeat(6, 1fr)"
                templateRows="repeat(2, minmax(5rem, auto))"
                p={2}
                zIndex="1"
                position="relative"
                top="0"
                left="0"
              >
                <GridItem colSpan={6} rowSpan={1}>
                  <Flex
                    direction="column"
                    alignItems="center"
                    justifyContent="flex-start"
                    h="full"
                    maxW="15rem"
                    overflow="hidden"
                  >
                    <Text
                      color={'white'}
                      borderRadius={5}
                      px={2}
                      bg={
                        id === selectedGarage
                          ? highlightedColor
                          : 'blackAlpha.800'
                      }
                      fontSize="sm"
                      noOfLines={1}
                      w="full"
                      textAlign="center"
                    >
                      {garages.entities[id]?.title}
                    </Text>
                  </Flex>
                </GridItem>
                <GridItem colSpan={6} rowSpan={1}>
                  <Flex
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="flex-end"
                    h="full"
                    maxW="15rem"
                    overflow="hidden"
                  >
                    <Text
                      color={'white'}
                      borderRadius={5}
                      px={2}
                      bg={
                        id === selectedGarage
                          ? highlightedColor
                          : 'blackAlpha.800'
                      }
                      fontSize="sm"
                      noOfLines={1}
                    >
                      {garages.entities[id]?.creator.displayName}
                    </Text>
                  </Flex>
                </GridItem>
              </Grid>
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
                currentUser,
                liveries,
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
  store.dispatch(getCars.initiate());
  await Promise.all(apiSlice.util.getRunningOperationPromises());
  return {
    props: {}
  };
});
