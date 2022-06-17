import { accessRowDataByKey } from './index';

describe('accessRowDataByKey funciton', () => {
  const testObject = {
    flat: 1,
    data: {
      flat: 2
    },
    res: {
      data: {
        flat: 3
      }
    }
  };
  it('correctly accesses a property 1 level deep', () => {
    const result = accessRowDataByKey('flat', testObject);
    expect(result).toBe(testObject['flat']);
  });
  it('correctly accesses a property 2 levels deep', () => {
    const result = accessRowDataByKey('data.flat', testObject);
    expect(result).toBe(testObject['data']['flat']);
  });
  it('correctly accesses a property 3 levels deep', () => {
    const result = accessRowDataByKey('res.data.flat', testObject);
    expect(result).toBe(testObject['res']['data']['flat']);
  });
});
