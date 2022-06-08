import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import {
  chakra,
  Box,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Grid,
  GridItem,
  Button,
  Flex,
  Text,
  Heading
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { SearchIcon } from '@chakra-ui/icons';
import { FormattedMessage, useIntl } from 'react-intl';

import { apiSlice, wrapper, useAppSelector } from '../../store/store';
import { getLiveries, useGetLiveriesQuery } from '../../store/livery/api-slice';
import { getCars, useGetCarsQuery } from '../../store/car/api-slice';

import { LiveryList } from '../../components/features';
import { MainLayout } from '../../components/layout';
import { PageHeading } from '../../components/shared';
import { ImageWithFallback } from '../../components/core';

import {
  GARAGES_URL,
  GARAGE_CREATE_URL,
  LIVERY_CREATE_URL
} from '../../utils/nav';
import { liveryStrings, garageStrings, commonStrings } from '../../utils/intl';
import { LiveriesFilterKeys, Order, KeyValueUnionOf } from '../../types';
import { useGetGaragesQuery } from '../../store/garage/api-slice';

const initialState = {
  ids: '',
  search: '',
  car: '',
  created: Order.ASC,
  rating: '0',
  garages: '',
  user: '0',
  page: 0
};
type FilterState = typeof initialState;

type Action = {
  type: keyof FilterState;
  payload: NonNullable<KeyValueUnionOf<FilterState>>;
};
const filtersReducer = (state: FilterState, action: Action): FilterState => {
  return {
    ...state,
    [action.payload.key]: action.payload.value
  };
};

const Garages: NextPage = () => {
  // STATE
  const [filters, dispatch] = useReducer(filtersReducer, initialState);
  const [selectedGarage, setSelectedGarage] = useState<string>('');

  // HOOKS
  const intl = useIntl();
  const currentUser = useAppSelector((state) => state.currentUserSlice);

  // QUERIES
  const { data: cars } = useGetCarsQuery();
  const { data: liveries } = useGetLiveriesQuery(filters);
  const { data: garages } = useGetGaragesQuery({
    ids: currentUser.garages.join('&')
  });

  /// EFFECTS
  useEffect(() => {
    dispatch({
      type: 'ids',
      payload: {
        key: 'ids',
        value:
          garages?.entities[selectedGarage]?.liveries.join('&') ||
          currentUser.liveries.join('&')
      }
    });
  }, [currentUser.liveries, garages?.entities, selectedGarage]);

  // HANDLERS
  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: LiveriesFilterKeys.SEARCH,
      payload: { key: LiveriesFilterKeys.SEARCH, value: event.target.value }
    });
  };
  const onCarChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: LiveriesFilterKeys.CAR,
      payload: { key: LiveriesFilterKeys.CAR, value: event.target.value }
    });
  };
  const onCreatedChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (value !== Order.ASC && value !== Order.DESC) return;
    dispatch({
      type: LiveriesFilterKeys.CREATED,
      payload: { key: LiveriesFilterKeys.CREATED, value: value }
    });
  };
  const onRatingChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: LiveriesFilterKeys.RATING,
      payload: { key: LiveriesFilterKeys.RATING, value: event.target.value }
    });
  };
  const onPageChange = (page: number) => () => {
    dispatch({
      type: LiveriesFilterKeys.PAGE,
      payload: { key: LiveriesFilterKeys.PAGE, value: page }
    });
  };
  const onSelectGarage = (id: string | undefined) => () =>
    setSelectedGarage(id || '');

  const pages = Array.from(
    Array(Math.ceil((liveries?.total || 1) / (liveries?.perPage || 1))).keys()
  );

  const highlightedColor = 'red';

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

      <chakra.section pt={4} w="5xl" display="flex" justifyContent="flex-start">
        <Grid
          templateColumns="repeat(9, 1fr)"
          templateRows="repeat(1, 1fr)"
          gap={4}
          w="5xl"
        >
          <GridItem colSpan={2} rowSpan={1}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                color="gray.300"
                fontSize="1.2em"
              >
                <SearchIcon />
              </InputLeftElement>
              <Input
                placeholder={intl.formatMessage(
                  commonStrings.searchPlaceholder
                )}
                onChange={onSearchChange}
                value={filters.search}
              />
            </InputGroup>
          </GridItem>
          <GridItem colSpan={3} rowSpan={1}>
            <Select
              placeholder={intl.formatMessage(
                commonStrings.selectCarPlaceholder
              )}
              onChange={onCarChange}
              value={filters.car}
            >
              {cars?.ids.map((id) => {
                const target = cars.entities[id];
                if (!target) return null;
                return (
                  <option key={id + target.name} value={target.name}>
                    {target.name}
                  </option>
                );
              })}
            </Select>
          </GridItem>
          <GridItem colSpan={2} rowSpan={1}>
            <Select
              placeholder={intl.formatMessage(
                commonStrings.createdAtPlaceholder
              )}
              value={filters.created}
              onChange={onCreatedChange}
            >
              <option value={Order.ASC}>Most recent first</option>
              <option value={Order.DESC}>Oldest first</option>
            </Select>
          </GridItem>
          <GridItem colSpan={2} rowSpan={1}>
            <Select
              placeholder={intl.formatMessage(commonStrings.ratingPlaceholder)}
              value={filters.rating}
              onChange={onRatingChange}
            >
              <option value={5}>5 Star </option>
              <option value={4}>4 Star +</option>
              <option value={3}>3 Star +</option>
              <option value={2}>2 Star +</option>
              <option value={1}>1 Star +</option>
            </Select>
          </GridItem>
        </Grid>
      </chakra.section>
      <LiveryList liveries={liveries} />
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
