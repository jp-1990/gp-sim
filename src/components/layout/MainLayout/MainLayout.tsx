import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  chakra,
  Box,
  Flex,
  Grid,
  Heading,
  List,
  ListItem,
  GridItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  HStack
} from '@chakra-ui/react';
import { useIntl, FormattedMessage } from 'react-intl';

import Meta from '../../shared/utils/Meta/Meta';
import { navOptions, LOGIN_URL, PROFILE_URL } from '../../../utils/nav/';
import { messages } from './MainLayout.messages';
import { profileStrings } from '../../../utils/intl';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { thunks } from '../../../store/user/slice';
import { ImageWithFallback } from '../../core';

const NavItem = ({ label, path }: { label: string; path?: string }) => (
  <ListItem mr={12}>
    <Link href={path || '/'}>
      <a>
        <Text fontSize={'lg'} fontWeight="bold">
          {label}
        </Text>
      </a>
    </Link>
  </ListItem>
);

interface Props {
  pageDescription: string;
  pageTitle?: string;
  urlPath?: string;
  ogImageUrl?: string;
  locale?: string;
  children?: React.ReactNode;
}

/**
 * The main web layout containing the header, footer, and content area rendering children. Also contains the Meta component, defining SEO properties using the Next.js Head component.
 * @param {Props['pageTitle']} props.pageTitle - String prepended to the site title found in the Meta component.
 * @param {Props['pageDescription']} props.pageDescription - String description of the page for the description and og:description meta tags. Should be less than 200 characters and succinctly describe the page.
 * @param {Props['urlPath']} props.urlPath - String url path for the current page, appended to the base url found in the Meta component.
 * @param {Props['ogImageUrl']} props.ogImageUrl - String url for the og:image meta tag.
 * @param {Props['locale']} props.locale - String locale (e.g. en_GB) for the og:locale meta tag.
 * @returns {React.FC} React function component
 */
const MainLayout: React.FC<Props> = ({
  pageTitle,
  pageDescription,
  urlPath,
  ogImageUrl,
  locale,
  children
}) => {
  const [contentMinHeight, setContentMinHeight] = useState<number>(0);
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(
    (state) => state.userSlice.currentUser.data
  );
  const logout = () => dispatch(thunks.signOut());

  const headerChakraHeight = 15;
  const footerChakraHeight = 15;
  const footerChakraPaddingTop = 9;
  useEffect(() => {
    const calculatedMinHeight =
      window.innerHeight -
      headerChakraHeight * 4 -
      footerChakraHeight * 4 -
      footerChakraPaddingTop * 4;
    setContentMinHeight(calculatedMinHeight);
  }, []);

  const backgroundColor = 'red.600';
  const textColor = 'white';

  return (
    <Flex direction={'column'}>
      <Meta
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        urlPath={urlPath}
        ogImageUrl={ogImageUrl}
        locale={locale}
      />
      {/* header */}
      <header>
        <Grid
          bg={backgroundColor}
          textColor={textColor}
          templateColumns="repeat(22, 1fr)"
        >
          <GridItem
            colSpan={5}
            h={14}
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            px={4}
          >
            <Heading size="md"></Heading>
          </GridItem>
          <GridItem colSpan={12} display="flex" alignItems="center" px={4}>
            <chakra.nav>
              <List display="flex" alignItems="center">
                {navOptions(intl).reduce((array, item) => {
                  const output = [...array];
                  const { requiresUser, label, path } = item;
                  if (requiresUser && !currentUser) return output;
                  output.push(
                    <NavItem key={label} label={label} path={path} />
                  );
                  return output;
                }, [] as JSX.Element[])}
              </List>
            </chakra.nav>
          </GridItem>
          <GridItem
            colSpan={5}
            h={14}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            px={4}
          >
            {!currentUser && (
              <Heading size="sm">
                <Link href={LOGIN_URL}>
                  <a>
                    <FormattedMessage {...messages.login} />
                  </a>
                </Link>
              </Heading>
            )}
            {currentUser && (
              <Menu isLazy>
                <MenuButton flexDir={'row'}>
                  <HStack gap={2}>
                    <Text size="sm">
                      <FormattedMessage {...profileStrings.profile} />
                    </Text>
                    <Flex
                      position="relative"
                      border="1px"
                      borderColor="gray.200"
                      overflow="hidden"
                      h={10}
                      w={10}
                      rounded={'xl'}
                    >
                      <ImageWithFallback
                        imgUrl={currentUser.image || ''}
                        imgAlt="user display image"
                      />
                    </Flex>
                  </HStack>
                </MenuButton>
                <MenuList textColor={'blackAlpha.900'}>
                  <Link
                    passHref
                    href={{ pathname: PROFILE_URL, query: { tab: 0 } }}
                  >
                    <MenuItem>
                      <a>
                        <FormattedMessage {...profileStrings.viewProfile} />
                      </a>
                    </MenuItem>
                  </Link>
                  <MenuDivider />
                  <Link
                    passHref
                    href={{ pathname: PROFILE_URL, query: { tab: 1 } }}
                  >
                    <MenuItem>
                      <a>
                        <FormattedMessage {...profileStrings.myLiveries} />
                      </a>
                    </MenuItem>
                  </Link>
                  <Link
                    passHref
                    href={{ pathname: PROFILE_URL, query: { tab: 2 } }}
                  >
                    <MenuItem>
                      <a>
                        <FormattedMessage {...profileStrings.myGarages} />
                      </a>
                    </MenuItem>
                  </Link>
                  <MenuDivider />
                  <MenuItem onClick={logout}>
                    <FormattedMessage {...messages.logout} />
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </GridItem>
        </Grid>
        <Box h={1} bg="red.400" boxShadow={'md'} />
      </header>

      {/* body */}
      <Flex
        alignItems="center"
        direction="column"
        minH={`${contentMinHeight}px`}
      >
        {children}
      </Flex>

      {/* footer */}
      <chakra.footer role="contentinfo" pt={9}>
        <Box h={1} bg="red.400" boxShadow={'md'} />
        <Grid
          bg={backgroundColor}
          textColor={textColor}
          templateColumns="repeat(22, 1fr)"
        >
          <GridItem
            colSpan={5}
            h={14}
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            px={4}
          ></GridItem>
          <GridItem colSpan={12} display="flex" alignItems="center" px={4}>
            <Flex
              alignItems={'center'}
              justifyContent="space-between"
              w={'full'}
            >
              <chakra.nav>
                <List display="flex" alignItems="center">
                  {navOptions(intl).reduce((array, item) => {
                    const output = [...array];
                    const { requiresUser, label, path } = item;
                    if (requiresUser && !currentUser) return output;
                    output.push(
                      <ListItem mr={8} key={label}>
                        <Link href={path || '/'}>
                          <a>
                            <Text fontSize={'md'} fontWeight="normal">
                              {label}
                            </Text>
                          </a>
                        </Link>
                      </ListItem>
                    );
                    return output;
                  }, [] as JSX.Element[])}
                  {currentUser && (
                    <ListItem mr={8} key="profile">
                      <Link href={{ pathname: PROFILE_URL, query: { tab: 0 } }}>
                        <a>
                          <FormattedMessage {...profileStrings.profile} />
                        </a>
                      </Link>
                    </ListItem>
                  )}
                </List>
              </chakra.nav>
              <Text fontSize={'sm'}>@JP 2022</Text>
            </Flex>
          </GridItem>
          <GridItem
            colSpan={5}
            h={14}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            px={4}
          ></GridItem>
        </Grid>
      </chakra.footer>
    </Flex>
  );
};

export default MainLayout;
