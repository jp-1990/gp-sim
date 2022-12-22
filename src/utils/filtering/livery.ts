import { LiveriesDataType, LiveriesFilters, Order } from '../../types';

/**
 * @param _liveries - array of liveries to sort and filter
 * @param filters - filters to apply to liveries array
 * @returns - filtered and sorted array of liveries
 */
export const applyLiveryFilters = (
  _liveries: LiveriesDataType,
  filters: LiveriesFilters
) => {
  const {
    car,
    created,
    lastLiveryId,
    ids: _ids,
    rating: _rating,
    search: _search
  } = filters;
  const ids = _ids?.split('&').filter((id) => id);
  const rating = _rating && !!+_rating ? +_rating : undefined;
  const search = _search?.toLowerCase();

  const limit = 12;
  let offset = 0;

  // clone input liveries
  let liveries = [];
  for (const livery of _liveries) {
    const creator = { ...livery.creator };
    const images = [...livery.images];
    const searchHelpers = [...livery.searchHelpers];
    liveries.push({ ...livery, creator, images, searchHelpers });
  }

  // filter
  liveries = liveries.filter((livery) => {
    if (ids?.length && !ids.includes(livery.id)) return false;
    if (car && car !== livery.car) return false;
    if (rating && rating < livery.rating) return false;
    if (search && !livery.searchHelpers.includes(search)) return false;
    return true;
  });

  // sort
  if (created) {
    liveries.sort((a, b) => {
      if (created === Order.ASC) return b.createdAt - a.createdAt;
      if (created === Order.DESC) return a.createdAt - b.createdAt;
      return 0;
    });
  }
  if (rating) {
    liveries.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // apply offset and limit
  if (lastLiveryId) {
    const lastLiveryIndex = liveries.findIndex(
      (livery) => livery.id === lastLiveryId
    );
    offset = lastLiveryIndex + 1;
  }
  liveries = liveries.slice(offset, offset + limit);

  return liveries;
};
