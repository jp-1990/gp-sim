import React from 'react';
import { ComponentWithAs, GridItem, GridItemProps } from '@chakra-ui/react';

const TableRowCell: ComponentWithAs<'div', GridItemProps> = ({
  children,
  ...chakraProps
}) => {
  return (
    <GridItem display="flex" alignItems="center" py={2} px={2} {...chakraProps}>
      {children}
    </GridItem>
  );
};

export default TableRowCell;
