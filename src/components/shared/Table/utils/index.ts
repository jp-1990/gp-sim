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
