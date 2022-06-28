import React, { Fragment } from 'react';
import { Box, Checkbox, Grid, GridProps, HStack } from '@chakra-ui/react';
import {
  TableActions,
  TableColumns,
  TableData,
  TableDataTypes,
  TableOnSelect,
  TableSelected
} from './types';

import TableHeaderCell from './components/TableHeaderCell/TableHeaderCell';
import TableRowCell from './components/TableRowCell/TableRowCell';
import { ImageWithFallback } from '../../core';
import {
  accessRowDataByKey,
  getCheckboxAriaLabel,
  getColSpan,
  onSelectAll,
  SELECT_ALL_CHECKBOX
} from './utils';

interface Props<T extends TableData> {
  actions?: TableActions<T>;
  chakraGridProps?: GridProps;
  columns: TableColumns;
  data: T;
  onSelect?: TableOnSelect<T>;
  selected?: TableSelected<T>;
}
export const Table = <DataT extends TableData>({
  actions,
  chakraGridProps,
  columns,
  data,
  onSelect,
  selected
}: Props<DataT>) => {
  const columnsWithExtras = [...columns];
  const hasCheckbox = onSelect && selected;
  const hasActions = actions?.length || 0 > 0;

  if (hasCheckbox) {
    columnsWithExtras.unshift({
      label: (
        <Checkbox
          aria-label={SELECT_ALL_CHECKBOX}
          size="lg"
          colorScheme={'red'}
          isChecked={selected?.length === data.length}
          isIndeterminate={
            !!selected?.length && selected?.length !== data.length
          }
          onChange={() => onSelectAll(data, selected, onSelect)}
        />
      ),
      dataKey: 'checkbox',
      type: TableDataTypes.ACTIONS
    });
  }
  if (hasActions) {
    columnsWithExtras.push({
      label: '',
      dataKey: 'actions',
      type: TableDataTypes.ACTIONS
    });
  }

  const checkboxCols = hasCheckbox ? 1 : 0;
  const actionCols = hasActions ? 3 : 0;
  const numColumns = columns.length * 3 + checkboxCols + actionCols;

  return (
    <Grid
      templateColumns={`repeat(${numColumns}, auto)`}
      maxW="5xl"
      minW="5xl"
      mt={4}
      {...chakraGridProps}
    >
      {columnsWithExtras.map((column, index) => {
        return (
          <TableHeaderCell
            key={column.dataKey}
            divider={!!column.label && index > 0}
            px={column.dataKey === TableDataTypes.CHECKBOX ? 3 : 2}
            colSpan={getColSpan(column.dataKey)}
          >
            {column.label}
          </TableHeaderCell>
        );
      })}
      {data.map((row) => {
        return (
          <Fragment key={row.id}>
            {hasCheckbox && (
              <TableRowCell
                colSpan={getColSpan(TableDataTypes.CHECKBOX)}
                px={3}
              >
                <Checkbox
                  aria-label={getCheckboxAriaLabel(row.id)}
                  size="lg"
                  colorScheme={'red'}
                  onChange={() => onSelect(row.id)}
                  isChecked={selected.includes(row.id)}
                />
              </TableRowCell>
            )}
            {columns.map((column) => {
              return (
                <TableRowCell
                  key={`${row.id}-${column.dataKey}`}
                  colSpan={getColSpan(column.dataKey)}
                >
                  {column.type === TableDataTypes.IMAGE && (
                    <Box
                      position="relative"
                      borderWidth="2px"
                      borderRadius={6}
                      borderColor={'blackAlpha.100'}
                      overflow="hidden"
                      h={20}
                      w={28}
                    >
                      <ImageWithFallback
                        imgAlt={row['title'] ?? 'image'}
                        imgUrl={
                          Array.isArray(accessRowDataByKey(column.dataKey, row))
                            ? accessRowDataByKey(column.dataKey, row)[0]
                            : accessRowDataByKey(column.dataKey, row)
                        }
                      />
                    </Box>
                  )}
                  {column.type === TableDataTypes.STRING &&
                    accessRowDataByKey(column.dataKey, row)}
                </TableRowCell>
              );
            })}
            {hasActions && (
              <TableRowCell colSpan={getColSpan(TableDataTypes.ACTIONS)}>
                <HStack spacing={2}>
                  {actions?.map((action, index) => (
                    <Fragment key={`${row.id}-action-${index}`}>
                      {action(row)}
                    </Fragment>
                  ))}
                </HStack>
              </TableRowCell>
            )}
          </Fragment>
        );
      })}
    </Grid>
  );
};
