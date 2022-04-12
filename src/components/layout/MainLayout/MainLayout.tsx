import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  chakra,
  Box,
  Button,
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
  MenuDivider
} from '@chakra-ui/react';
import { useUser } from '@auth0/nextjs-auth0';
import { useIntl, FormattedMessage } from 'react-intl';

import Meta from '../../shared/utils/Meta/Meta';
import { navOptions, LOGIN_URL, LOGOUT_URL } from '../../../utils/nav/';
import { messages } from './MainLayout.messages';
import { commonStrings } from '../../../utils/intl';

const NavItem = ({ label, path }: { label: string; path?: string }) => (
  <ListItem mr={10}>
    <Link href={path || '/'}>
      <a>
        <Heading size={'md'}>{label}</Heading>
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
  const { user } = useUser();
  const intl = useIntl();

  const headerChakraHeight = 14;
  const footerChakraHeight = 28;
  useEffect(() => {
    const calculatedMinHeight =
      window.innerHeight - headerChakraHeight * 4 - footerChakraHeight * 4;
    setContentMinHeight(calculatedMinHeight);
  }, []);

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
        <Grid bg="red.600" templateColumns="repeat(22, 1fr)">
          <GridItem
            colSpan={5}
            h={14}
            bg="red.300"
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            px={4}
          >
            <Heading size="md">Sim Paddock</Heading>
          </GridItem>
          <GridItem colSpan={12} display="flex" alignItems="center" px={4}>
            <chakra.nav>
              <List display="flex" alignItems="center">
                {navOptions(intl).reduce((array, item) => {
                  const output = [...array];
                  const { requiresUser, label, path } = item;
                  if (requiresUser && !user) return output;
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
            bg="red.800"
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            px={4}
          >
            {!user && (
              <Button size="sm">
                <Link href={LOGIN_URL}>
                  <a>
                    <FormattedMessage {...messages.login} />
                  </a>
                </Link>
              </Button>
            )}
            {user && (
              <Menu isLazy>
                <MenuButton>
                  <Heading size="sm">
                    <FormattedMessage {...commonStrings.profile} />
                  </Heading>
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    <FormattedMessage {...commonStrings.viewProfile} />
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem>
                    <FormattedMessage {...commonStrings.myGarages} />
                  </MenuItem>
                  <MenuItem>
                    <FormattedMessage {...commonStrings.myLiveries} />
                  </MenuItem>
                  {/* <MenuItem>
                    <FormattedMessage {...commonStrings.mySetups} />
                  </MenuItem> */}
                  <MenuDivider />
                  <MenuItem>
                    <Link href={LOGOUT_URL}>
                      <a>
                        <FormattedMessage {...messages.logout} />
                      </a>
                    </Link>
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </GridItem>
        </Grid>
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
        <Flex h={28} bg="red.600">
          <Box p="2">
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by{' '}
              <span>
                <Image
                  src="/vercel.svg"
                  alt="Vercel Logo"
                  width={72}
                  height={16}
                />
              </span>
            </a>
          </Box>
        </Flex>
      </chakra.footer>
    </Flex>
  );
};

export default MainLayout;
