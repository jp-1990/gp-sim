import { ChangeEvent, Fragment, useEffect, useReducer, useState } from 'react';
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
  Heading,
  Checkbox,
  HStack,
  Divider
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { SearchIcon } from '@chakra-ui/icons';
import { FormattedMessage, useIntl } from 'react-intl';

import { apiSlice, wrapper, useAppSelector } from '../../store/store';
import { getLiveries, useGetLiveriesQuery } from '../../store/livery/api-slice';
import { getCars, useGetCarsQuery } from '../../store/car/api-slice';

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
import { LiveriesFilterKeys, Order, KeyValueUnionOf } from '../../types';
import { useGetGaragesQuery } from '../../store/garage/api-slice';

const initialState = {
  ids: '',
  search: '',
  car: '',
  created: Order.ASC,
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
  const [selectedLiveries, setSelectedLiveries] = useState<(string | number)[]>(
    []
  );

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

  const onPageChange = (page: number) => () => {
    setSelectedLiveries([]);
    dispatch({
      type: LiveriesFilterKeys.PAGE,
      payload: { key: LiveriesFilterKeys.PAGE, value: page }
    });
  };
  const onSelectGarage = (id: string | undefined) => () => {
    setSelectedLiveries([]);
    setSelectedGarage(id || '');
    dispatch({
      type: LiveriesFilterKeys.PAGE,
      payload: { key: LiveriesFilterKeys.PAGE, value: 0 }
    });
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

  const toggleSelectedLivery =
    (id: string | number) => (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedLiveries((prev) => {
        if (!e.target.checked && prev.includes(id))
          return prev.filter((el) => el !== id);
        return [...prev, id];
      });
    };
  const toggleAllLiveries = () => {
    if (selectedLiveries.length) return setSelectedLiveries([]);
    return setSelectedLiveries(liveries?.ids || []);
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
          <GridItem colSpan={2} rowSpan={1} />
        </Grid>
      </chakra.section>

      {/* liveries list */}
      <Grid templateColumns="repeat(18, 1fr)" maxW="5xl" mt={4}>
        <GridItem colSpan={18}>
          <Divider />
        </GridItem>
        <GridItem
          bg="#fafafa"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          py={2}
          px={2}
          colSpan={1}
          h={12}
        >
          <Checkbox
            size="lg"
            colorScheme={'red'}
            isChecked={selectedLiveries.length === liveries?.ids.length}
            isIndeterminate={
              !!selectedLiveries.length &&
              selectedLiveries.length !== liveries?.ids.length
            }
            onChange={toggleAllLiveries}
          />
          <Divider orientation="vertical" />
        </GridItem>
        <GridItem
          bg="#fafafa"
          fontWeight={'bold'}
          color="gray.800"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          py={2}
          px={2}
          colSpan={6}
          h={12}
        >
          <FormattedMessage {...commonStrings.livery} />
          <Divider orientation="vertical" />
        </GridItem>
        <GridItem
          bg="#fafafa"
          fontWeight={'bold'}
          color="gray.800"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          py={2}
          px={2}
          colSpan={4}
          h={12}
        >
          <FormattedMessage {...formStrings.creator} />
          <Divider orientation="vertical" />
        </GridItem>
        <GridItem
          bg="#fafafa"
          fontWeight={'bold'}
          color="gray.800"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          py={2}
          px={2}
          colSpan={4}
          h={12}
        >
          <FormattedMessage {...formStrings.car} />
        </GridItem>
        <GridItem
          bg="#fafafa"
          fontWeight={'bold'}
          color="gray.800"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          py={2}
          px={2}
          colSpan={3}
          h={12}
        />
        <GridItem colSpan={18}>
          <Divider />
        </GridItem>
        {liveries?.ids.map((id) => {
          return (
            <Fragment key={id}>
              <GridItem
                display="flex"
                alignItems="center"
                py={2}
                px={2}
                colSpan={1}
              >
                <Checkbox
                  size="lg"
                  colorScheme={'red'}
                  onChange={toggleSelectedLivery(id)}
                  isChecked={selectedLiveries.includes(id)}
                ></Checkbox>
              </GridItem>
              <GridItem
                display="flex"
                alignItems="center"
                py={2}
                px={2}
                colSpan={2}
              >
                <Box
                  position="relative"
                  borderWidth="2px"
                  borderRadius={6}
                  borderColor={'blackAlpha.100'}
                  overflow="hidden"
                  h={20}
                  w={28}
                >
                  <ImageWithFallback
                    imgAlt={liveries.entities[id]?.title}
                    imgUrl={liveries.entities[id]?.images[0]}
                  />
                </Box>
              </GridItem>
              <GridItem
                display="flex"
                alignItems="center"
                py={2}
                px={2}
                colSpan={4}
              >
                {liveries.entities[id]?.title}
              </GridItem>
              <GridItem
                display="flex"
                alignItems="center"
                py={2}
                px={2}
                colSpan={4}
              >
                {liveries.entities[id]?.creator.displayName}
              </GridItem>
              <GridItem
                display="flex"
                alignItems="center"
                py={2}
                px={2}
                colSpan={4}
              >
                {liveries.entities[id]?.car}
              </GridItem>
              <GridItem
                display="flex"
                alignItems="center"
                py={2}
                px={2}
                colSpan={3}
              >
                <HStack spacing={2}>
                  <Link href={LIVERY_URL(`${id}`)} passHref>
                    <Button variant={'outline'} size="sm" colorScheme="red">
                      <FormattedMessage {...commonStrings.view} />
                    </Button>
                  </Link>
                  <Button
                    disabled={disableDownload(id)}
                    onClick={onDownload(id)}
                    variant={'solid'}
                    size="sm"
                    colorScheme="red"
                  >
                    <FormattedMessage {...commonStrings.download} />
                  </Button>
                </HStack>
              </GridItem>
              <GridItem colSpan={18}>
                <Divider />
              </GridItem>
            </Fragment>
          );
        })}
      </Grid>

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
