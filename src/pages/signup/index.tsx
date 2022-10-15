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
  HStack,
  Input as ChakraInput,
  Text
} from '@chakra-ui/react';

import { MainLayout } from '../../components/layout';

import { useAppDispatch, useAppSelector, wrapper } from '../../store/store';
import { SIGNUP_URL } from '../../utils/nav';
import { Form, Input, SubmitButton, useForm } from '../../components/shared';
import {
  FOCUS_BORDER_COLOR,
  validatorOptions
} from '../../components/shared/Form/utils';
import { commonStrings, formStrings } from '../../utils/intl';
import { signUp, ThunkStatus } from '../../store/user/slice';
import ControlWrapper from '../../components/shared/Form/components/ControlWrapper/ControlWrapper';

const validators = {
  displayName: [validatorOptions.NON_NULL_STRING],
  email: [validatorOptions.NON_NULL_STRING, validatorOptions.EMAIL],
  password: [
    validatorOptions.NON_NULL_STRING,
    validatorOptions.PASSWORD_FORMAT,
    validatorOptions.PASSWORD_LENGTH
  ],
  confirmPassword: [validatorOptions.NON_NULL_STRING]
};

type FormState = {
  forename: string | undefined;
  surname: string | undefined;
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupForm = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.currentUserSlice);

  const { state, setStateImmutably } = useForm<FormState>();

  const confirmPasswordIsValid = state.password === state.confirmPassword;

  const onConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateImmutably((state) => {
      state.confirmPassword = event.target.value;
      return state;
    });
  };

  const onSubmit = ({
    forename,
    surname,
    displayName,
    email,
    password
  }: FormState) => {
    dispatch(signUp({ forename, surname, displayName, email, password }));
  };

  return (
    <Grid
      templateColumns="repeat(12, 1fr)"
      templateRows="repeat(10)"
      gap={4}
      w="md"
      my={8}
    >
      <GridItem rowSpan={3} colSpan={12}>
        <HStack spacing={4}>
          <Input
            stateKey={'forename'}
            label={<FormattedMessage {...formStrings.firstName} />}
            aria-label={intl.formatMessage(formStrings.firstName)}
            w="3xs"
          />
          <Input
            stateKey={'surname'}
            label={<FormattedMessage {...formStrings.lastName} />}
            aria-label={intl.formatMessage(formStrings.lastName)}
            w="3xs"
          />
        </HStack>
      </GridItem>
      <GridItem rowSpan={3} colSpan={12}>
        <Input
          isRequired
          validators={validators.displayName}
          stateKey={'displayName'}
          label={<FormattedMessage {...formStrings.displayName} />}
          aria-label={intl.formatMessage(formStrings.displayName)}
          w="xs"
        />
      </GridItem>
      <GridItem rowSpan={3} colSpan={10}>
        <Input
          isRequired
          validators={validators.email}
          stateKey={'email'}
          label={<FormattedMessage {...formStrings.email} />}
          aria-label={intl.formatMessage(formStrings.email)}
          placeholder={intl.formatMessage(formStrings.emailPlaceholder)}
        />
      </GridItem>
      <GridItem rowSpan={3} colSpan={8}>
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
      <GridItem rowSpan={3} colSpan={8}>
        <ControlWrapper
          htmlFor={'confirmPassword-input'}
          label={<FormattedMessage {...formStrings.confirmPassword} />}
          ariaLabel={intl.formatMessage(formStrings.confirmPassword)}
          isRequired={true}
          isValid={confirmPasswordIsValid}
          errorText={<FormattedMessage {...formStrings.invalidPasswordMatch} />}
        >
          <ChakraInput
            test-id={'confirmPassword-input'}
            id={'confirmPassword-input'}
            onChange={onConfirmPasswordChange}
            value={state['confirmPassword'] || ''}
            focusBorderColor={FOCUS_BORDER_COLOR}
            placeholder={'********'}
            type="password"
          />
        </ControlWrapper>
      </GridItem>
      <GridItem rowSpan={4} colSpan={12}>
        <Box display={'flex'} flexDirection="column" alignItems={'center'}>
          <SubmitButton
            onClick={onSubmit}
            colorScheme="red"
            w="2xs"
            mt={20}
            lineHeight={1}
            isLoading={status === ThunkStatus.PENDING}
            loadingText={intl.formatMessage(commonStrings.loading)}
          >
            <FormattedMessage {...commonStrings.signUp} />
          </SubmitButton>
        </Box>
      </GridItem>
    </Grid>
  );
};

const Signup: NextPage = () => {
  return (
    <MainLayout
      pageTitle="Sign up"
      pageDescription="Sign up for an account"
      urlPath={SIGNUP_URL}
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
              <FormattedMessage {...commonStrings.signUp} />
            </Heading>
            <Text fontSize="md">
              <FormattedMessage {...formStrings.createAnAccount} />
            </Text>
          </Flex>
        </chakra.section>
        <Form>
          <SignupForm />
        </Form>
      </Box>
    </MainLayout>
  );
};

export default Signup;

export const getStaticProps = wrapper.getStaticProps(() => async () => {
  return {
    props: {}
  };
});
