import { LiveriesDataType } from '../../types';

export const randomNumber = (min: number, max: number) => {
  const range = Math.abs(max + 1 - min);
  return Math.floor(Math.random() * range) + min;
};

export const applyFilters = (
  liveries: LiveriesDataType,
  args: (string | null)[]
) => {
  const [search, car, priceMin, priceMax, created, rating, quantity] = args;

  const filteredLiveries = liveries.filter((livery, index) => {
    let shouldReturn = true;
    if (search) {
      shouldReturn = false;
      livery.searchHelpers.forEach((el) => {
        if (shouldReturn) return;
        shouldReturn = el.toLowerCase() === search.toLowerCase();
      });
    }
    if (car) shouldReturn = livery.car.toLowerCase() === car.toLowerCase();
    if (priceMin && !!+priceMin)
      shouldReturn = (livery.price || 0) >= +priceMin * 100;
    if (priceMax && !!+priceMax) {
      shouldReturn = (livery.price || 0) <= +priceMax * 100;
    }
    if (rating && !!+rating) shouldReturn = (livery.rating || 0) >= +rating;
    if (quantity) shouldReturn = index < +quantity;
    return shouldReturn;
  });

  if (created) {
    filteredLiveries.sort((a, b) => {
      if (created === 'asc') {
        let sort = b.createdAt - a.createdAt;
        if (sort === 0) {
          sort = b.downloads - a.downloads;
        }
        return sort;
      }
      if (created === 'desc') {
        let sort = a.createdAt - b.createdAt;
        if (sort === 0) {
          sort = b.downloads - a.downloads;
        }
        return sort;
      }
      return 0;
    });
  }

  if (rating && !!+rating) {
    filteredLiveries.sort((a, b) => {
      let sort = (b.rating || 0) - (a.rating || 0);
      if (sort === 0) {
        sort = b.downloads - a.downloads;
      }
      return sort;
    });
  }

  if ((priceMin && !!+priceMin) || (priceMax && !!+priceMax)) {
    filteredLiveries.sort((a, b) => {
      let sort = (b.price || 0) - (a.price || 0);
      if (sort === 0) {
        sort = b.downloads - a.downloads;
      }
      return sort;
    });
  }
  return filteredLiveries;
};
