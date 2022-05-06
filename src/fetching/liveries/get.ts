import { LiveriesDataType, LiveryDataType, LiveriesFilters } from '../../types';
import fs from 'fs';

export interface GetLiveriesArgs {
  filters: LiveriesFilters;
  quantity?: number;
}
export const getLiveries = async ({ filters, quantity }: GetLiveriesArgs) => {
  return new Promise<LiveriesDataType>((resolve) => {
    const data = fs.readFileSync('src/utils/dev-data/liveries.json', 'utf-8');
    const liveries = JSON.parse(data);
    liveries.length = quantity;
    setTimeout(() => resolve(liveries), 200);
  });
};

export interface GetLiveryArgs {
  id: string;
}
export const getLivery = async ({ id }: GetLiveryArgs) => {
  return new Promise<LiveryDataType>((resolve) => {
    const data = fs.readFileSync('src/utils/dev-data/liveries.json', 'utf-8');
    const livery = JSON.parse(data).find(
      (item: LiveryDataType) => item.id === id
    );
    setTimeout(() => resolve(livery), 200);
  });
};
