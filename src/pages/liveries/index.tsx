import { useEffect } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';

import {
  apiSlice,
  useAppDispatch,
  useAppSelector,
  wrapper
} from '../../store/store';
import {
  FilterActionPayload,
  actions as liveryActions,
  selectors as liverySelectors,
  thunks as liveryThunks
} from '../../store/livery/slice';
import { actions as carActions } from '../../store/car/slice';

import { LiveryList, LiveryFilter, Mode } from '../../components/features';
import { MainLayout } from '../../components/layout';
import { PageHeading } from '../../components/shared';

import { LIVERIES_URL, LIVERY_CREATE_URL, LIVERY_URL } from '../../utils/nav';
import { liveryStrings } from '../../utils/intl';
import { LiveryDataType } from '../../types';
import { useInfiniteScroll } from '../../hooks';
import { getCars } from '../../lib/getCars';

const Liveries: NextPage = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(liveryActions.activatePage(LIVERIES_URL));
    return () => {
      dispatch(liveryActions.activatePage(null));
    };
  }, [dispatch]);

  const filters = useAppSelector(liverySelectors.selectFilters);
  const lastLiveryId = useAppSelector(liverySelectors.selectLastLiveryId);
  const scrollY = useAppSelector(
    liverySelectors.createSelectScrollY(LIVERIES_URL)
  );

  const liveries = {
    ids: useAppSelector(liverySelectors.selectLiveryIds),
    entities: useAppSelector(liverySelectors.selectLiveryEntities)
  };

  const { Loader } = useInfiniteScroll(
    () => dispatch(liveryThunks.getLiveries({ ...filters, lastLiveryId })),
    liveries
  );

  useEffect(() => {
    if (scrollY)
      window.scrollTo({
        top: scrollY,
        behavior: 'auto'
      });
  }, [scrollY]);

  const onClickLivery = (livery: LiveryDataType) => {
    dispatch(liveryActions.scrollYChanged(window.scrollY));
    router.push(LIVERY_URL(livery.id));
  };

  const setFilters = (payload: FilterActionPayload) =>
    dispatch(liveryActions.filtersChanged(payload));

  return (
    <MainLayout
      pageTitle="Liveries"
      pageDescription="Find your next livery from the collection uploaded by our users!"
      urlPath={LIVERIES_URL}
    >
      <PageHeading
        heading={<FormattedMessage {...liveryStrings.liveriesHeading} />}
        paragraph={<FormattedMessage {...liveryStrings.liveriesSummary} />}
      />
      <Flex w="full" maxW="5xl" my={5}>
        <Button colorScheme="red" w="3xs" lineHeight={1}>
          <Link href={LIVERY_CREATE_URL}>
            <a>
              <FormattedMessage {...liveryStrings.uploadALivery} />
            </a>
          </Link>
        </Button>
      </Flex>
      <LiveryFilter
        mode={Mode.FULL}
        setFilters={setFilters}
        filters={filters}
      />
      <LiveryList liveries={liveries} onClickLivery={onClickLivery} />
      <Loader />
    </MainLayout>
  );
};

export default Liveries;

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  const cars = await getCars();
  store.dispatch(carActions.setCars(cars));

  store.dispatch(liveryThunks.getLiveries({}));
  await Promise.all(apiSlice.util.getRunningOperationPromises());
  return {
    props: {}
  };
});
