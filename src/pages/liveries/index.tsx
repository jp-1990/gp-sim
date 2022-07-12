import { useEffect, useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { FormattedMessage } from 'react-intl';

import { apiSlice, wrapper } from '../../store/store';
import { getLiveries, useGetLiveriesQuery } from '../../store/livery/api-slice';
import { getCars } from '../../store/car/api-slice';

import { LiveryList } from '../../components/features';
import { MainLayout } from '../../components/layout';
import { PageHeading } from '../../components/shared';

import { LIVERIES_URL, LIVERY_CREATE_URL } from '../../utils/nav';
import { liveryStrings } from '../../utils/intl';
import Link from 'next/link';
import { LiveriesFilterKeys as Keys } from '../../types';
import LiveryFilter, {
  Mode
} from '../../components/features/liveries/LiveryFilter/LiveryFilter';
import { useLiveryFilters } from '../../hooks/use-livery-filters';

const Liveries: NextPage = () => {
  const [maxPriceCap, setMaxPriceCap] = useState<number>(0);

  const { filters, setFilters } = useLiveryFilters();

  const { data: liveries } = useGetLiveriesQuery(filters);

  useEffect(() => {
    if (liveries?.maxPrice && liveries.maxPrice / 100 > maxPriceCap) {
      const value = (liveries?.maxPrice || 0) / 100;
      setMaxPriceCap(value);
    }
  }, [liveries?.maxPrice, maxPriceCap]);

  const onPageChange = (page: number) => () =>
    setFilters({ key: Keys.PAGE, value: page });

  const pages = Array.from(
    Array(Math.ceil((liveries?.total || 1) / (liveries?.perPage || 1))).keys()
  );

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
        filters={filters}
        setFilters={setFilters}
        maxPriceCap={maxPriceCap}
      />
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

export default Liveries;

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  store.dispatch(getCars.initiate());
  store.dispatch(getLiveries.initiate({}));
  await Promise.all(apiSlice.util.getRunningOperationPromises());
  return {
    props: {}
  };
});
