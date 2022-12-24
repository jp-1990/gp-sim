import { applyLiveryFilters } from './livery';
import { Order } from '../../types';

import cars from '../dev-data/cars.json';
import data from '../dev-data/liveries.json';

describe('apply livery filters', () => {
  test('should correctly apply ids filter', () => {
    const targetIds = `${data[0].id}&${data[1].id}&${data[2].id}`;
    const filteredLiveries = applyLiveryFilters(data, { ids: targetIds });

    expect(filteredLiveries).toHaveLength(3);

    const targetIdsArray = targetIds.split('&');
    for (const livery of filteredLiveries) {
      expect(targetIdsArray.includes(livery.id)).toBeTruthy();
    }
  });
  test('should correctly apply car filter', () => {
    const car = cars[0].name;
    const filteredLiveries = applyLiveryFilters(data, { car });

    for (const livery of filteredLiveries) {
      expect(livery.car).toEqual(car);
    }
  });
  test('should correctly apply rating filter', () => {
    const rating = 3;
    const filteredLiveries = applyLiveryFilters(data, { rating: `${rating}` });

    for (const livery of filteredLiveries) {
      expect(livery.rating).toBeGreaterThanOrEqual(rating);
    }
  });
  test('should correctly apply search filter', () => {
    const search = 'PuRple tIgeR';
    const searchTerms = search.toLowerCase().split(' ');

    const filteredLiveries = applyLiveryFilters(data, { search });

    for (const livery of filteredLiveries) {
      expect(
        livery.searchHelpers.some((e) => searchTerms.includes(e.toLowerCase()))
      ).toBeTruthy();
    }
  });
  test('should correctly sort by created (asc)', () => {
    const filteredLiveries = applyLiveryFilters(data, { created: Order.ASC });

    let prevCreatedAt = filteredLiveries[0].createdAt;
    for (let i = 1; i < filteredLiveries.length; i++) {
      expect(filteredLiveries[i].createdAt).toBeLessThanOrEqual(prevCreatedAt);
      prevCreatedAt = filteredLiveries[i].createdAt;
    }
  });
  test('should correctly sort by created (desc)', () => {
    const filteredLiveries = applyLiveryFilters(data, { created: Order.DESC });

    let prevCreatedAt = filteredLiveries[0].createdAt;
    for (let i = 1; i < filteredLiveries.length; i++) {
      expect(filteredLiveries[i].createdAt).toBeGreaterThanOrEqual(
        prevCreatedAt
      );
      prevCreatedAt = filteredLiveries[i].createdAt;
    }
  });
  test('should correctly sort by rating', () => {
    const rating = 3;
    const filteredLiveries = applyLiveryFilters(data, { rating: `${rating}` });

    let prevRating = filteredLiveries[0].rating;
    for (let i = 1; i < filteredLiveries.length; i++) {
      expect(filteredLiveries[i].rating).toBeGreaterThanOrEqual(rating);
      expect(filteredLiveries[i].rating).toBeGreaterThanOrEqual(prevRating);
      prevRating = filteredLiveries[i].rating;
    }
  });
  test('should correctly apply limit and offset', () => {
    const filteredLiveries = applyLiveryFilters(data, {});

    expect(filteredLiveries).toHaveLength(12);

    const lastLiveryId = filteredLiveries[filteredLiveries.length - 1].id;

    const offsetFilteredLiveries = applyLiveryFilters(data, { lastLiveryId });

    expect(offsetFilteredLiveries).toHaveLength(12);
    expect(offsetFilteredLiveries[0].id).not.toEqual(lastLiveryId);
  });
});
