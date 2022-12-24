import { applyUserFilters } from './user';
import data from '../dev-data/users.json';
import { Order } from '../../types';

describe('apply user filters', () => {
  test('should correctly apply ids filter', () => {
    const targetIds = `${data[0].id}&${data[1].id}&${data[2].id}`;
    const filteredUsers = applyUserFilters(data, { ids: targetIds });

    expect(filteredUsers).toHaveLength(3);

    const targetIdsArray = targetIds.split('&');
    for (const user of filteredUsers) {
      expect(targetIdsArray.includes(user.id)).toBeTruthy();
    }
  });
  test('should correctly sort by created (asc)', () => {
    const filteredUsers = applyUserFilters(data, { created: Order.ASC });

    let prevCreatedAt = filteredUsers[0].createdAt;
    for (let i = 1; i < filteredUsers.length; i++) {
      expect(filteredUsers[i].createdAt).toBeLessThanOrEqual(prevCreatedAt);
      prevCreatedAt = filteredUsers[i].createdAt;
    }
  });
  test('should correctly sort by created (desc)', () => {
    const filteredUsers = applyUserFilters(data, { created: Order.DESC });

    let prevCreatedAt = filteredUsers[0].createdAt;
    for (let i = 1; i < filteredUsers.length; i++) {
      expect(filteredUsers[i].createdAt).toBeGreaterThanOrEqual(prevCreatedAt);
      prevCreatedAt = filteredUsers[i].createdAt;
    }
  });
});
