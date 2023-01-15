import { chakra, Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useAuthCheck } from '../../../hooks';
import { RequestStatus } from '../../../types';

import { commonStrings } from '../../../utils/intl';
import { MainLayout } from '../../layout';

/**
 * Displays a page with the header and nav bar, informing the user that they need to log in to view this page
 */
const Unauthorized = () => {
  // AUTH CHECK
  const { currentUser } = useAuthCheck();

  if (currentUser.status === RequestStatus.IDLE && !currentUser.token)
    return null;
  return (
    <MainLayout pageDescription="User unauthorized">
      <chakra.section pt={16}>
        <Flex direction="column" maxW="5xl" align={'center'}>
          <Heading size="2xl" pb={4}>
            <FormattedMessage {...commonStrings.unauthorized} />
          </Heading>
          <Text fontSize="lg" pt={2}>
            <FormattedMessage {...commonStrings.pleaseLogIn} />
          </Text>
        </Flex>
      </chakra.section>
    </MainLayout>
  );
};

export default Unauthorized;
