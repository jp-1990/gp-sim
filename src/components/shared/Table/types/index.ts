import { ReactNode } from 'react';

export enum TableDataTypes {
  STRING = 'string',
  IMAGE = 'image',
  ACTIONS = 'actions',
  CHECKBOX = 'checkbox'
}
export type TableData = (Record<string, any> & {
  id: string;
})[];

export type TableAction<T> = (props: T) => JSX.Element;

export type TableActions<T extends TableData> = TableAction<T[number]>[];

export interface TableColumn {
  label: ReactNode;
  dataKey: string;
  type: TableDataTypes;
}
export type TableColumns = TableColumn[];

export type TableSelected<T extends TableData> = T[number]['id'][];
export type TableOnSelect<T extends TableData> = (
  id: T[number]['id'] | T[number]['id'][]
) => void;
