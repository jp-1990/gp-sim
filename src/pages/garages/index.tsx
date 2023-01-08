import { ChangeEvent, useEffect, useState } from 'react';
import {
  chakra,
  Box,
  Button,
  Flex,
  Text,
  Heading,
  InputGroup,
  Input,
  InputRightElement,
  HStack,
  useToast,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  IconButton,
  Divider
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FormattedMessage, useIntl } from 'react-intl';

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

import { GarageDataType, LiveriesDataType } from '../../types';
import {
  useAuthCheck,
  useDownloadLivery,
  useInfiniteScroll
} from '../../hooks';
import db, { CacheKeys } from '../../lib';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import { Icons } from '../../utils/icons/icons';

const Garages: NextPage = () => {
  // AUTH CHECK
  const { currentUser } = useAuthCheck();

  const intl = useIntl();
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
    ids: useAppSelector(
      garageSelectors.createSelectUserInGarageIds(currentUser.data?.id || '')
    ),
    entities: useAppSelector(
      garageSelectors.createSelectUserInGarageEntities(
        currentUser.data?.id || ''
      )
    )
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
          value: currentUser.data?.liveries?.join('&') ?? ''
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

  // JOIN GARAGE
  const [joinGarageLoading, setJoinGarageLoading] = useState(false);
  const [garageKey, setGarageKey] = useState('');

  const toast = useToast({
    duration: 8000,
    isClosable: true,
    position: 'top',
    containerStyle: {
      marginTop: '1.25rem'
    }
  });

  const onJoinGarage = async () => {
    try {
      if (!garageKey) return;
      setJoinGarageLoading(true);

      const res = await dispatch(garageThunks.joinGarage({ id: garageKey }));

      toast({
        title: intl.formatMessage(formStrings.joinSuccess, {
          garage: (res.payload as GarageDataType).title
        }),
        status: 'success'
      });
      setJoinGarageLoading(false);
      setGarageKey('');
    } catch (err) {
      toast({
        title: intl.formatMessage(commonStrings.error),
        description: intl.formatMessage(formStrings.joinError),
        status: 'error'
      });
      setJoinGarageLoading(false);
    }
  };

  const onGarageKeyChange = (e: ChangeEvent<HTMLInputElement>) =>
    setGarageKey(e.target?.value);

  // ADD TO GARAGE
  const [isAddToGarageModalVisible, setIsAddToGarageModalVisble] =
    useState(false);
  const [addToGarageLoading, setAddToGarageLoading] = useState(false);
  const [recipientGarage, setRecipientGarage] = useState('');
  const onToggleAddToGarageModal = () => setIsAddToGarageModalVisble((p) => !p);

  const onOpenAddToGarageModal = (id: string) => {
    if (!selectedLiveries.includes(id)) toggleSelectedLiveries(id);
    onToggleAddToGarageModal();
  };

  const onRecipientGarageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRecipientGarage(event.target.value);
  };

  const onAddToGarage = async () => {
    try {
      if (!recipientGarage) return;
      setAddToGarageLoading(true);

      const formData = new FormData();
      formData.append('liveriesToAdd', JSON.stringify(selectedLiveries));
      await dispatch(
        garageThunks.updateGarageByIdLiveries({ id: recipientGarage, formData })
      );

      toast({
        title: intl.formatMessage(formStrings.updateSuccess, {
          item: intl.formatMessage(commonStrings.garage)
        }),
        status: 'success'
      });
      setIsAddToGarageModalVisble(false);
      setAddToGarageLoading(false);
      setRecipientGarage('');
    } catch (error) {
      toast({
        title: intl.formatMessage(commonStrings.error),
        description: intl.formatMessage(formStrings.updateError, {
          item: intl.formatMessage(commonStrings.garage)
        }),
        status: 'error'
      });
      setAddToGarageLoading(false);
    }
  };

  const highlightedColor = 'red.500';
  const disableDownload = (liveryId: string | number) =>
    !currentUser.data?.liveries?.find((id) => `${liveryId}` === id);

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
      <HStack w="full" maxW="5xl" my={5} gap={2}>
        <Link href={GARAGE_CREATE_URL} passHref>
          <Button colorScheme="red" w="3xs" lineHeight={1}>
            <a>
              <FormattedMessage {...garageStrings.createAGarage} />
            </a>
          </Button>
        </Link>
        <span>OR</span>
        <InputGroup w="sm">
          <Input
            value={garageKey}
            onChange={onGarageKeyChange}
            placeholder={intl.formatMessage(formStrings.joinGaragePlaceholder)}
          />
          <InputRightElement w="auto">
            <Button
              isLoading={joinGarageLoading}
              colorScheme="red"
              variant="outline"
              onClick={onJoinGarage}
              rightIcon={<Icons.People value={{ color: '#C53030' }} />}
            >
              <FormattedMessage {...garageStrings.joinGarage} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </HStack>

      {/* modal */}
      <Modal
        onClose={onToggleAddToGarageModal}
        isOpen={isAddToGarageModalVisible}
        size="2xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Liveries To A Garage</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* garage select */}
            <Box maxW={'md'}>
              <Select
                id="recipient-garage-select"
                placeholder={intl.formatMessage(formStrings.garagePlaceholder)}
                onChange={onRecipientGarageChange}
                value={recipientGarage}
              >
                {garages.ids.map((id) => {
                  return (
                    <option key={id} value={id}>
                      {garages.entities[id].title}
                    </option>
                  );
                })}
              </Select>
            </Box>
            {/* liveries list */}
            <Table<LiveriesDataType>
              chakraGridProps={{ maxW: 'lg', minW: 'lg' }}
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
              hideHeaders
            />
          </ModalBody>
          <ModalFooter>
            <HStack my={2}>
              <Button onClick={onToggleAddToGarageModal}>
                <FormattedMessage {...commonStrings.cancel} />
              </Button>
              <Button
                variant={'solid'}
                colorScheme="red"
                onClick={onAddToGarage}
                isLoading={addToGarageLoading}
                disabled={!recipientGarage}
              >
                <FormattedMessage {...commonStrings.addToGarage} />
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* garage list */}
      <chakra.section
        mt={4}
        w="5xl"
        display="flex"
        flexDir={'column'}
        bg={'gray.50'}
        rounded="md"
      >
        {garages && (
          <chakra.section
            p={4}
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
              bg="gray.200"
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
                <Icons.Car
                  color={
                    selectedGarage === null ? '#E53E3E' : 'rgba(0, 0, 0, 0.80)'
                  }
                  size={'200px'}
                />
              </Flex>
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
                      id === selectedGarage
                        ? highlightedColor
                        : 'blackAlpha.800'
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

        <Divider />
        {/* selected garage info */}
        <chakra.section
          w="5xl"
          pt={6}
          px={4}
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
        >
          <Heading size="md" pb={4}>
            {garages?.entities[selectedGarage ?? '']?.title ?? (
              <FormattedMessage {...garageStrings.yourCollection} />
            )}
          </Heading>
          <Text fontSize="sm" pb={6}>
            {garages?.entities[selectedGarage ?? '']?.description ?? (
              <FormattedMessage {...garageStrings.yourCollectionDescription} />
            )}
          </Text>
        </chakra.section>
      </chakra.section>

      {/* search and filter */}
      <LiveryFilter
        mode={Mode.FULL}
        filters={filters}
        setFilters={setFilters}
      />

      {/* liveries list */}
      <Table<LiveriesDataType>
        actions={[
          ({ id }) => {
            return selectedGarage === null ? (
              <a onClick={() => onOpenAddToGarageModal(id)}>
                <IconButton
                  variant={'ghost'}
                  size="sm"
                  colorScheme="red"
                  aria-label={'add to garage'}
                  icon={
                    <Icons.Add
                      tooltip={intl.formatMessage(commonStrings.add)}
                    />
                  }
                />
              </a>
            ) : (
              <></>
            );
          },
          ({ id }) => (
            <a onClick={() => onClickLivery(id)}>
              <IconButton
                variant={'ghost'}
                size="sm"
                colorScheme="red"
                aria-label={'view livery'}
                icon={
                  <Icons.View
                    tooltip={intl.formatMessage(commonStrings.view)}
                  />
                }
              />
            </a>
          ),
          ({ id }) => (
            <IconButton
              disabled={disableDownload(id)}
              onClick={onDownload({
                selectedLiveries,
                targetLiveryId: id
              })}
              variant={'solid'}
              size="sm"
              colorScheme="red"
              aria-label={'download livery'}
              icon={
                <Icons.Download
                  tooltip={intl.formatMessage(commonStrings.download)}
                />
              }
            />
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
