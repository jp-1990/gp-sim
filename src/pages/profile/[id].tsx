import {
  Box,
  Button,
  Flex,
  Heading,
  Grid,
  Text,
  GridItem
} from '@chakra-ui/react';
import { GetStaticPaths, NextPage } from 'next';
import React, { useEffect } from 'react';
import { ImageWithFallback } from '../../components/core';
import { LiveryList } from '../../components/features';
import LiveryFilter, {
  Mode
} from '../../components/features/liveries/LiveryFilter/LiveryFilter';
import { MainLayout } from '../../components/layout';
import { useLiveryFilters } from '../../hooks/use-livery-filters';
import { useGetLiveriesQuery } from '../../store/livery/api-slice';
import store, { apiSlice, wrapper } from '../../store/store';
import {
  getUserById,
  getUsers,
  useGetUserByIdQuery
} from '../../store/user/api-slice';
import { LiveriesFilterKeys } from '../../types';
import { isString } from '../../utils/functions';
import { PROFILE_URL_BY_ID } from '../../utils/nav';

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
      <Grid pt={8} maxW="5xl" templateColumns={`repeat(2, auto)`} gap={8}>
        <GridItem>
          <Flex direction="column" maxW="5xl">
            <Heading size="2xl" pb={4}>
              {selectedUser?.displayName}
            </Heading>
            <Text fontSize="lg" pt={2}>
              {selectedUser?.about}
            </Text>
          </Flex>
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
      {/* liveries list */}
      <LiveryFilter
        mode={Mode.BASIC}
        filters={liveryFilters}
        setFilters={setLiveryFilters}
      />
      <LiveryList liveries={liveries} />
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
  const { data } = await store.dispatch(getUsers.initiate({}));
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
