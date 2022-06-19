import {
  TableData,
  TableDataTypes,
  TableOnSelect,
  TableSelected
} from '../types';

/**
 * Recursively access a nested property within an object.
 * @param {string} key - path to data within the row object (e.g. 'res.data.id').
 * @param {object} row - object containing the data you wish to access.
 * @returns Data present in the row object at the key path provided.
 */
export const accessRowDataByKey = <T extends Record<string, any>>(
  key: string | undefined,
  row: T
): any => {
  if (!key || !row) return;
  const path = key.split('.');
  if (path.length === 1) return row[path[0]];
  const nextKey = path.shift() || '';
  return accessRowDataByKey<typeof row[typeof nextKey]>(
    path.join('.'),
    row[nextKey]
  );
};

/**
 * Wrapper around the provided onSelect function to toggle all ids selected
 * @param {TableData} data - array of data objects. as a minimum, each object must must contain id: string | number
 * @param {string[]} selected - array of currently selected ids
 * @param {TableOnSelect} onSelect - function to add or removed ids from selected
 */
export const onSelectAll = <T extends TableData>(
  data: T,
  selected: TableSelected<T>,
  onSelect: TableOnSelect<T>
) => {
  if (selected.length) return onSelect([]);
  return onSelect(data.map(({ id }) => id));
};

/**
 * Helper function to determine the number of columns a cell should span based on the data key provided
 * @param {TableDataTypes.ACTIONS | TableDataTypes.CHECKBOX | string} dataKey - data key for the target column
 * @returns 1 | 3 | 3 based on dataKey input
 */
export const getColSpan = (
  dataKey: TableDataTypes.ACTIONS | TableDataTypes.CHECKBOX | string
) => {
  switch (dataKey) {
    case TableDataTypes.CHECKBOX:
      return 1;
    case TableDataTypes.ACTIONS:
      return 3;
    default:
      return 3;
  }
};
