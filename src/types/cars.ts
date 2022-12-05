export enum CarClass {
  GT3 = 'GT3',
  GT4 = 'GT4',
  GTC = 'GTC',
  TCX = 'TCX'
}

export enum Games {
  ACC = 'acc'
}

export interface CarDataType {
  id: string;
  class: CarClass;
  game: Games;
  name: string;
}
export type CarsDataType = CarDataType[];
