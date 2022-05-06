import fs from 'fs';
import { CarsDataType } from '../../types';

export const getCars = async () => {
  return new Promise<CarsDataType>((resolve) => {
    const data = fs.readFileSync('src/utils/dev-data/cars.json', 'utf-8');
    const cars = JSON.parse(data);
    setTimeout(() => resolve(cars), 200);
  });
};
