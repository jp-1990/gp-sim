import { ValidationOptionsType } from '../utils/validation';

export interface DefaultInputProps {
  label?: React.ReactNode;
  validators?: ValidationOptionsType[];
  stateKey: string;
}
