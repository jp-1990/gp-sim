import { useCallback, useEffect, useRef } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { FormattedMessage } from 'react-intl';

import {
  apiSlice,
  useAppDispatch,
  useAppSelector,
  wrapper
} from '../../store/store';
import { getLiveries, useGetLiveriesQuery } from '../../store/livery/api-slice';
import { getCars } from '../../store/car/api-slice';
import {
  FilterActionPayload,
  filtersChanged,
  lastLiveryChanged,
  scrollYChanged,
  selectFilters,
  selectLastLiveryId,
  selectLiveryEntities,
  selectLiveryIds,
  selectScrollY
} from '../../store/pages/liveries-page-slice';

import { LiveryList } from '../../components/features';
import { MainLayout } from '../../components/layout';
import { PageHeading } from '../../components/shared';

import { LIVERIES_URL, LIVERY_CREATE_URL, LIVERY_URL } from '../../utils/nav';
import { liveryStrings } from '../../utils/intl';
import Link from 'next/link';
import LiveryFilter, {
  Mode
} from '../../components/features/liveries/LiveryFilter/LiveryFilter';
import { useRouter } from 'next/router';
import { LiveryDataType } from '../../types';

const Liveries: NextPage = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => selectFilters(state));
  const lastLiveryId = useAppSelector((state) => selectLastLiveryId(state));
  const scrollY = useAppSelector((state) => selectScrollY(state));

  const liveries = {
    ids: useAppSelector(selectLiveryIds),
    entities: useAppSelector(selectLiveryEntities)
  };

  const { isFetching } = useGetLiveriesQuery(
    {
      ...filters,
      lastLiveryId
    },
    { refetchOnMountOrArgChange: true }
  );

  const loader = useRef(null);
  const handleObserver: IntersectionObserverCallback = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isFetching && liveries.ids.length) {
        dispatch(lastLiveryChanged());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [liveries.ids]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '330px',
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    if (scrollY)
      window.scrollTo({
        top: scrollY,
        behavior: 'auto'
      });
  }, [scrollY]);

  const onClickLivery = (livery: LiveryDataType) => {
    dispatch(scrollYChanged(window.scrollY));
    router.push(LIVERY_URL(livery.id));
  };

  const setFilters = (payload: FilterActionPayload) =>
    dispatch(filtersChanged(payload));

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
      <div ref={loader} />
    </MainLayout>
  );
};

export default Liveries;

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  store.dispatch(getCars.initiate());
  // @ts-expect-error no idea
  store.dispatch(getLiveries.initiate());
  await Promise.all(apiSlice.util.getRunningOperationPromises());
  return {
    props: {}
  };
});
