import React from 'react';
import {
  ComponentWithAs,
  Divider,
  GridItem,
  GridItemProps
} from '@chakra-ui/react';

const TableHeaderCell: ComponentWithAs<
  'div',
  GridItemProps & { divider?: boolean }
> = ({ children, divider = true, ...chakraProps }) => {
  return (
    <GridItem
      bg="#fafafa"
      fontWeight="bold"
      color="gray.800"
      display="flex"
      alignItems="center"
      py={2}
      h={12}
      {...chakraProps}
    >
      {divider && <Divider pr={3} orientation="vertical" />}
      {children}
    </GridItem>
  );
};

export default TableHeaderCell;
