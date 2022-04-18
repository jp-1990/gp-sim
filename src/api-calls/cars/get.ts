import { CarsDataType } from '../../types';
import { cars } from '../../utils/dev-data/liveries';

export const getCars = async () => {
  return new Promise<CarsDataType>((resolve) => {
    const carsData = cars.map((car, i) => ({
      id: `${i}`,
      name: car,
      class: 'GT4'
    }));
    setTimeout(() => resolve(carsData), 100);
  });
};
