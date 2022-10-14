import React from 'react';
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

import { MainLayout } from '../../components/layout';

import { useAppDispatch, useAppSelector, wrapper } from '../../store/store';
import { LOGIN_URL } from '../../utils/nav';
import { Form, Input, SubmitButton } from '../../components/shared';
import { validatorOptions } from '../../components/shared/Form/utils';
import { commonStrings, formStrings } from '../../utils/intl';
import { signIn, ThunkStatus } from '../../store/user/slice';

const validators = {
  email: [validatorOptions.NON_NULL_STRING, validatorOptions.EMAIL],
  password: [
    validatorOptions.NON_NULL_STRING,
    validatorOptions.PASSWORD_FORMAT,
    validatorOptions.PASSWORD_LENGTH
  ]
};

const Login: NextPage = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.currentUserSlice);

  const onSubmit = async (state: { email: string; password: string }) => {
    dispatch(signIn(state));
  };

  return (
    <MainLayout
      pageTitle="Login"
      pageDescription="Login with your email and password"
      urlPath={LOGIN_URL}
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
              <FormattedMessage {...commonStrings.login} />
            </Heading>
            <Text fontSize="md">
              <FormattedMessage {...formStrings.welcomeBack} />
            </Text>
          </Flex>
        </chakra.section>
        <Form>
          <Grid
            templateColumns="repeat(12, 1fr)"
            templateRows="repeat(10, 14px)"
            gap={4}
            w="sm"
            my={12}
          >
            <GridItem rowSpan={3} colSpan={12}>
              <Input
                isRequired
                validators={validators.email}
                stateKey={'email'}
                label={<FormattedMessage {...formStrings.email} />}
                aria-label={intl.formatMessage(formStrings.email)}
                placeholder={intl.formatMessage(formStrings.emailPlaceholder)}
              />
            </GridItem>
            <GridItem rowSpan={3} colSpan={12}>
              <Input
                isRequired
                validators={validators.password}
                stateKey={'password'}
                label={<FormattedMessage {...formStrings.password} />}
                aria-label={intl.formatMessage(formStrings.password)}
                placeholder={'********'}
                type="password"
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
                  w="2xs"
                  mt={8}
                  lineHeight={1}
                  isLoading={status === ThunkStatus.PENDING}
                >
                  <FormattedMessage {...commonStrings.login} />
                </SubmitButton>
                <Text hidden={!error} mt={4} color={'red.500'}>
                  <FormattedMessage {...formStrings.emailOrPasswordError} />
                </Text>
              </Box>
            </GridItem>
          </Grid>
        </Form>
      </Box>
    </MainLayout>
  );
};

export default Login;

export const getStaticProps = wrapper.getStaticProps(() => async () => {
  return {
    props: {}
  };
});
