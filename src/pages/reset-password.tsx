import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Box,
  chakra,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text
} from '@chakra-ui/react';

import { MainLayout } from '../components/layout';

import { useAppDispatch, useAppSelector } from '../store/store';
import { LOGIN_URL, RESET_PASSWORD } from '../utils/nav';
import { Form, Input, SubmitButton } from '../components/shared';
import { commonStrings, formStrings } from '../utils/intl';
import { RequestStatus } from '../types';
import { actions, selectors, thunks } from '../store/user/slice';
import Link from 'next/link';

const Login: NextPage = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectors.selectCurrentUserStatus);

  useEffect(() => {
    return () => {
      dispatch(actions.resetStatus());
    };
  }, [dispatch]);

  const onSubmit = async (state: { email: string }) => {
    if (!state.email) return;
    dispatch(thunks.resetPassword(state.email));
  };

  return (
    <MainLayout
      pageTitle="Reset password"
      pageDescription="Reset your password"
      urlPath={RESET_PASSWORD}
    >
      <Box
        maxW="5xl"
        w="5xl"
        flex={1}
        display="flex"
        flexDir={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <chakra.section pt={8}>
          <Flex direction="column" alignItems={'center'} maxW="5xl">
            <Heading size="xl" pb={4}>
              <FormattedMessage {...commonStrings.resetPassword} />
            </Heading>
            <Text fontSize="md">
              <FormattedMessage {...commonStrings.forgottenPassword} />
            </Text>
          </Flex>
        </chakra.section>
        <Form>
          <Grid
            templateColumns="repeat(12, 1fr)"
            templateRows="repeat(10, 8px)"
            gap={4}
            w="xs"
            my={8}
            mb={0}
          >
            <GridItem rowSpan={3} colSpan={12}>
              <Input
                stateKey={'email'}
                label={<FormattedMessage {...formStrings.email} />}
                aria-label={intl.formatMessage(formStrings.email)}
                placeholder={intl.formatMessage(formStrings.emailPlaceholder)}
              />
            </GridItem>
            <GridItem rowSpan={4} colSpan={12}>
              <Box
                display={'flex'}
                flexDirection="column"
                alignItems={'center'}
              >
                <SubmitButton
                  onClick={onSubmit}
                  colorScheme="red"
                  w="3xs"
                  mt={8}
                  lineHeight={1}
                  isLoading={status === RequestStatus.PENDING}
                  loadingText={intl.formatMessage(commonStrings.loading)}
                >
                  <FormattedMessage {...commonStrings.resetPassword} />
                </SubmitButton>
              </Box>
            </GridItem>
          </Grid>
        </Form>
        <Link href={{ pathname: LOGIN_URL }}>
          <a>
            <Text as="b" fontSize="lg" color={'red.600'}>
              <FormattedMessage
                {...commonStrings.backTo}
                values={{ value: intl.formatMessage(commonStrings.login) }}
              />
            </Text>
          </a>
        </Link>
      </Box>
    </MainLayout>
  );
};

export default Login;
