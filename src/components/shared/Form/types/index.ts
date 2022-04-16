import { ValidationOptionsType } from '../utils/validation';

export type FormStatusType = {
  loading: boolean;
  error: boolean;
  isValid: boolean;
};
export type SetFormStatusType = (
  status: keyof FormStatusType,
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
