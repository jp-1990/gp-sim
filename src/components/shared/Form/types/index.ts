import { ValidationOptionsType } from '../utils/validation';

export type FormStatusType = {
  loading: boolean;
  error: boolean;
  invalidFields: string[];
};
export type SetFormStatusType = (
  status: keyof Omit<FormStatusType, 'invalidFields'>,
  value: boolean
) => void;

export type FormInitialStateType = FormStatusType;
export type FormStateType = FormInitialStateType & Record<string, any>;

export interface FormValueType {
  state: FormStateType;
  setState: React.Dispatch<React.SetStateAction<FormStateType>>;
}

export interface DefaultInputProps {
  label?: React.ReactNode;
  validators?: ValidationOptionsType[];
  stateKey: string;
}
