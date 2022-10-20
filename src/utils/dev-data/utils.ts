import { GaragesDataType, LiveriesDataType } from '../../types';

export const randomNumber = (min: number, max: number) => {
  const range = Math.abs(max + 1 - min);
  return Math.floor(Math.random() * range) + min;
};

export const applyLiveryFilters = (
  liveries: LiveriesDataType,
  args: [
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null
  ]
) => {
  const [ids, search, car, priceMin, priceMax, created, rating, user] = args;
  const idArray = ids?.split('&');

  let filteredLiveries = liveries.filter((livery) => {
    let shouldReturn = true;
    if (ids && !idArray?.includes(`${livery.id}`)) return false;
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
    return shouldReturn;
  });

  if (user) {
    filteredLiveries = filteredLiveries.filter((livery) => {
      return user === livery.creator.id;
    });
  }

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

export const applyGarageFilters = (
  garages: GaragesDataType,
  args: [string | null, string | null, string | null, string | null]
) => {
  const [ids, created, user, search] = args;
  const idArray = ids?.split('&');

  const filteredGarages = garages.filter((garage) => {
    let shouldReturn = false;
    if (idArray) shouldReturn = idArray.includes(garage.id);
    if (user)
      shouldReturn =
        user === garage.creator.id || garage.drivers.includes(user);
    if (search) shouldReturn = garage.title.includes(search);
    return shouldReturn;
  });

  if (created) {
    filteredGarages.sort((a, b) => {
      if (created === 'asc') {
        return b.createdAt - a.createdAt;
      }
      if (created === 'desc') {
        return a.createdAt - b.createdAt;
      }
      return 0;
    });
  }

  return filteredGarages;
};
