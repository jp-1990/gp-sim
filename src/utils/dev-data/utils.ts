import { LiveriesDataType } from '../../types';

export const randomNumber = (min: number, max: number) => {
  const range = Math.abs(max + 1 - min);
  return Math.floor(Math.random() * range) + min;
};

export const applyFilters = (
  liveries: LiveriesDataType,
  args: (string | null)[]
) => {
  const [search, car, priceMin, priceMax, createdAt, rating, quantity] = args;

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
    if (priceMin) shouldReturn = (livery.price || 0) >= +priceMin;
    if (priceMax) shouldReturn = (livery.price || 0) <= +priceMax;
    if (rating) shouldReturn = (livery.rating || 0) >= +rating;
    if (quantity) shouldReturn = index < +quantity;
    return shouldReturn;
  });
  if (priceMin || priceMax)
    filteredLiveries.sort((a, b) => (b.price || 0) - (a.price || 0));
  if (rating)
    filteredLiveries.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (createdAt)
    filteredLiveries.sort((a, b) => {
      if (createdAt === 'asc') return b.createdAt - a.createdAt;
      if (createdAt === 'desc') return a.createdAt - b.createdAt;
      return 0;
    });
  return filteredLiveries;
};
