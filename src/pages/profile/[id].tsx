import {
  Box,
  Button,
  Flex,
  Heading,
  Grid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  GridItem
} from '@chakra-ui/react';
import { GetStaticPaths, NextPage } from 'next';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { ImageWithFallback } from '../../components/core';
import { MainLayout } from '../../components/layout';
import { PageHeading } from '../../components/shared';
import { Table } from '../../components/shared/Table/Table';
import { TableDataTypes } from '../../components/shared/Table/types';
import { useLiveryFilters } from '../../hooks/use-livery-filters';
import { useGetLiveriesQuery } from '../../store/livery/api-slice';
import store, { apiSlice, wrapper } from '../../store/store';
import {
  getUserById,
  getUsers,
  useGetUserByIdQuery
} from '../../store/user/api-slice';
import { LiveriesDataType, LiveriesFilterKeys } from '../../types';
import { isString } from '../../utils/functions';
import { commonStrings, formStrings, profileStrings } from '../../utils/intl';
import { LIVERY_URL, PROFILE_URL_BY_ID } from '../../utils/nav';

interface Props {
  id: string;
}
const Profile: NextPage<Props> = ({ id }) => {
  const { filters: liveryFilters, setFilters: setLiveryFilters } =
    useLiveryFilters();

  const { data: liveries } = useGetLiveriesQuery(liveryFilters);
  const { data: selectedUser } = useGetUserByIdQuery(id);

  useEffect(() => {
    setLiveryFilters({
      key: LiveriesFilterKeys.USER,
      value: selectedUser?.id || ''
    });
  }, [selectedUser, setLiveryFilters]);

  const liveryPages = Array.from(
    Array(Math.ceil((liveries?.total || 1) / (liveries?.perPage || 1))).keys()
  );

  const onLiveryPageChange = (page: number) => () => {
    setLiveryFilters({ key: LiveriesFilterKeys.PAGE, value: page });
  };

  return (
    <MainLayout
      pageTitle="Profile"
      pageDescription="User profile home screen."
      urlPath={PROFILE_URL_BY_ID(id)}
    >
      <PageHeading
        heading={<FormattedMessage {...profileStrings.profileHeading} />}
        paragraph={<FormattedMessage {...profileStrings.profileSummary} />}
      />
      <Flex w="full" maxW="5xl" my={5}>
        <Tabs variant="enclosed" isLazy defaultIndex={0} colorScheme="red">
          <TabList>
            <Tab aria-label={commonStrings.profile.defaultMessage}>
              <FormattedMessage {...commonStrings.profile} />
            </Tab>
            <Tab aria-label={commonStrings.liveries.defaultMessage}>
              <FormattedMessage {...commonStrings.liveries} />
            </Tab>
          </TabList>
          <TabPanels>
            {/* profile info */}
            <TabPanel mt={4}>
              <Heading size="lg" pb={4}>
                {selectedUser?.displayName}
              </Heading>
              <Grid templateColumns={`repeat(2, auto)`} gap={8}>
                <GridItem>
                  <Text fontSize="lg" pt={2}>
                    {selectedUser?.about}
                  </Text>
                </GridItem>
                <GridItem>
                  <Box
                    position="relative"
                    borderWidth="2px"
                    borderRadius={6}
                    borderColor={'blackAlpha.100'}
                    overflow="hidden"
                    h={200}
                    w={280}
                  >
                    <ImageWithFallback
                      imgAlt={selectedUser?.displayName}
                      imgUrl={selectedUser?.image ?? undefined}
                    />
                  </Box>
                </GridItem>
              </Grid>
            </TabPanel>
            {/* liveries list */}
            <TabPanel>
              <Table<LiveriesDataType>
                actions={[
                  ({ id }) => (
                    <Link href={LIVERY_URL(`${id}`)} passHref>
                      <Button variant={'outline'} size="sm" colorScheme="red">
                        <FormattedMessage {...commonStrings.view} />
                      </Button>
                    </Link>
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
              />
              {liveryPages.length > 1 && (
                <Flex w="5xl" justifyContent="flex-end">
                  <Flex mt={4}>
                    {liveryPages.map((page) => {
                      return (
                        <Button
                          mx={1}
                          border="1px solid #c4c4c4"
                          key={page + 1}
                          colorScheme={
                            (liveries?.page || 0) === page ? 'red' : undefined
                          }
                          lineHeight={1}
                          onClick={onLiveryPageChange(page)}
                        >
                          {page + 1}
                        </Button>
                      );
                    })}
                  </Flex>
                </Flex>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </MainLayout>
  );
};

export default Profile;

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ params }) => {
      const paramsId = params?.id;
      let id = '';
      if (isString(paramsId)) {
        id = paramsId;
        store.dispatch(getUserById.initiate(id));
        await Promise.all(apiSlice.util.getRunningOperationPromises());
      }
      return {
        props: {
          id
        }
      };
    }
);

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await store.dispatch(getUsers.initiate(undefined));
  const ids = data?.ids ?? [];
  return {
    paths: ids.map((id) => ({
      params: {
        id: `${id.valueOf()}`
      }
    })),
    fallback: 'blocking'
  };
};
