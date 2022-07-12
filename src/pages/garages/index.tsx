import { useEffect, useState } from 'react';
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
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';

import { apiSlice, wrapper, useAppSelector } from '../../store/store';
import { getLiveries, useGetLiveriesQuery } from '../../store/livery/api-slice';
import { getCars } from '../../store/car/api-slice';

import { MainLayout } from '../../components/layout';
import { PageHeading } from '../../components/shared';
import { ImageWithFallback } from '../../components/core';

import {
  GARAGES_URL,
  GARAGE_CREATE_URL,
  LIVERY_CREATE_URL,
  LIVERY_URL
} from '../../utils/nav';
import {
  liveryStrings,
  garageStrings,
  commonStrings,
  formStrings
} from '../../utils/intl';
import { LiveriesFilterKeys as Keys, LiveriesDataType } from '../../types';
import { useGetGaragesQuery } from '../../store/garage/api-slice';
import { Table } from '../../components/shared/Table/Table';
import { TableDataTypes } from '../../components/shared/Table/types';
import LiveryFilter, {
  Mode
} from '../../components/features/liveries/LiveryFilter/LiveryFilter';
import { useLiveryFilters } from '../../hooks/use-livery-filters';

const Garages: NextPage = () => {
  // STATE
  const [selectedGarage, setSelectedGarage] = useState<string>('');
  const [selectedLiveries, setSelectedLiveries] = useState<(string | number)[]>(
    []
  );

  // HOOKS
  const currentUser = useAppSelector((state) => state.currentUserSlice);
  const { filters, setFilters } = useLiveryFilters();

  // QUERIES
  const { data: liveries } = useGetLiveriesQuery(filters);
  const { data: garages } = useGetGaragesQuery({
    ids: currentUser.garages.join('&')
  });

  /// EFFECTS
  useEffect(() => {
    setFilters({
      key: Keys.IDS,
      value:
        garages?.entities[selectedGarage]?.liveries.join('&') ||
        currentUser.liveries.join('&')
    });
  }, [currentUser.liveries, garages?.entities, selectedGarage, setFilters]);

  // HANDLERS
  const onPageChange = (page: number) => () => {
    setSelectedLiveries([]);
    setFilters({ key: Keys.PAGE, value: page });
  };
  const onSelectGarage = (id: string | undefined) => () => {
    setSelectedLiveries([]);
    setSelectedGarage(id || '');
    setFilters({ key: Keys.PAGE, value: 0 });
  };

  const onDownload = (targetLiveryId: string | number) => () => {
    const liveriesToDownload = [
      ...new Set([...selectedLiveries, targetLiveryId])
    ];
    const liveryFileURLs = liveriesToDownload.reduce((prev, id) => {
      if (!currentUser.liveries.includes(`${id}`)) return prev;
      const output = [...prev];
      const URL = liveries?.entities[id]?.liveryFiles;
      if (URL) output.push(URL);
      return output;
    }, [] as string[]);

    for (let i = 0, j = liveryFileURLs.length; i < j; i++) {
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = liveryFileURLs[i];
        }
      }, 200 + i * 200);
    }
  };

  const toggleSelectedLiveries = (
    id: (string | number) | (string | number)[]
  ) => {
    if (typeof id === 'object') return setSelectedLiveries(id);
    setSelectedLiveries((prev) => {
      if (prev.includes(id)) return prev.filter((id) => id !== id);
      return [...prev, id];
    });
  };

  const pages = Array.from(
    Array(Math.ceil((liveries?.total || 1) / (liveries?.perPage || 1))).keys()
  );

  const highlightedColor = 'red.500';
  const disableDownload = (liveryId: string | number) =>
    !currentUser.liveries.find((id) => `${liveryId}` === id);

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
          <Link href={LIVERY_CREATE_URL}>
            <a>
              <FormattedMessage {...liveryStrings.uploadALivery} />
            </a>
          </Link>
        </Button>
        <Button colorScheme="red" w="3xs" lineHeight={1} ml={2}>
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
            onClick={onSelectGarage('')}
            key="userCollection"
            mb={2}
            mx={0.5}
            position="relative"
            borderWidth="2px"
            borderRadius={6}
            borderColor={
              selectedGarage === '' ? highlightedColor : 'blackAlpha.100'
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
                      selectedGarage === ''
                        ? highlightedColor
                        : 'blackAlpha.800'
                    }
                    fontSize="sm"
                    isTruncated
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
                      isTruncated
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
                      isTruncated
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
          {garages?.entities[selectedGarage]?.title ?? (
            <FormattedMessage {...garageStrings.yourCollection} />
          )}
        </Heading>
        <Text fontSize="sm" pb={4}>
          {garages?.entities[selectedGarage]?.description ?? (
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
            <Link href={LIVERY_URL(`${id}`)} passHref>
              <Button variant={'outline'} size="sm" colorScheme="red">
                <FormattedMessage {...commonStrings.view} />
              </Button>
            </Link>
          ),
          ({ id }) => (
            <Button
              disabled={disableDownload(id)}
              onClick={onDownload(id)}
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
      <Flex w="5xl" justifyContent="flex-end">
        <Flex mt={4}>
          {pages.map((page) => {
            return (
              <Button
                mx={1}
                border="1px solid #c4c4c4"
                key={page + 1}
                colorScheme={(liveries?.page || 0) === page ? 'red' : undefined}
                lineHeight={1}
                onClick={onPageChange(page)}
              >
                {page + 1}
              </Button>
            );
          })}
        </Flex>
      </Flex>
    </MainLayout>
  );
};

export default Garages;

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  store.dispatch(getCars.initiate());
  store.dispatch(getLiveries.initiate({}));
  await Promise.all(apiSlice.util.getRunningOperationPromises());
  return {
    props: {}
  };
});
