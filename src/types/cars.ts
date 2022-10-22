export enum CarClass {
  GT3 = 'GT3',
  GT4 = 'GT4',
  GTC = 'GTC',
  TCX = 'TCX'
}

export interface CarDataType {
  id: string;
  class: CarClass;
  name: string;
}
export type CarsDataType = CarDataType[];
