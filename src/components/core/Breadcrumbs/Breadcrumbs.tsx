import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  chakra
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

interface Breadcrumb {
  name: React.ReactNode;
  href: string | undefined;
}

const buildBreadcrumbs = (options: Breadcrumb[]) => {
  return options.map(({ name, href }, i) => {
    return href ? (
      <BreadcrumbItem key={i} color="gray.400">
        <Link href={href} passHref>
          <BreadcrumbLink>{name}</BreadcrumbLink>
        </Link>
      </BreadcrumbItem>
    ) : (
      <BreadcrumbItem key={i} color="gray.400">
        <BreadcrumbLink>{name}</BreadcrumbLink>
      </BreadcrumbItem>
    );
  });
};

interface Props {
  options: Breadcrumb[];
}
/**
 *
 * @param {Props['options']} props.options - { name: string, href?: string }[ ]. Used to build breadcrumbs. If href is missing, the breadcrumb will appear but will not link anywhere on click.
 * @returns Function Component
 */
const Breadcrumbs: React.FC<Props> = ({ options }) => {
  return (
    <chakra.section pt={4} maxW="5xl">
      <Breadcrumb spacing={4} separator={<ChevronRightIcon color="gray.400" />}>
        {buildBreadcrumbs(options)}
      </Breadcrumb>
    </chakra.section>
  );
};

export default Breadcrumbs;
