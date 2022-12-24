import { Order, UserFilters, UsersDataType } from '../../types';

/**
 * @param _users - array of users to sort and filter
 * @param filters - filters to apply to users array
 * @returns - filtered and sorted array of users
 */
export const applyUserFilters = (
  _users: UsersDataType,
  filters: UserFilters
) => {
  const { created, ids: _ids } = filters;
  const ids = _ids?.split('&').filter((id) => id);

  // clone input users
  let users = [];
  for (const user of _users) {
    const liveries = { ...user.liveries };
    const garages = { ...user.garages };
    users.push({ ...user, liveries, garages });
  }

  // filter
  users = users.filter((livery) => {
    if (ids?.length && !ids.includes(livery.id)) return false;
    return true;
  });

  // sort
  if (created) {
    users.sort((a, b) => {
      if (created === Order.ASC) return b.createdAt - a.createdAt;
      if (created === Order.DESC) return a.createdAt - b.createdAt;
      return 0;
    });
  }

  return users;
};
