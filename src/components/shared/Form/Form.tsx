import React, { useState } from 'react';
import { FormValueType, FormStateType } from './types';

const FormContext = React.createContext<FormValueType | null>(null);

export const FORM_CONTEXT_ERROR = 'useForm must be used within a Form';
const useForm = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error(FORM_CONTEXT_ERROR);
  }
  return context;
};

export const initialFormState = {
  loading: false,
  error: false,
  invalidFields: []
};

const FormProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<FormStateType>(initialFormState);

  const value = { state, setState };
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export { FormProvider as Form, useForm };
export { default as Checkbox } from './components/Checkbox/Checkbox';
export { default as Input } from './components/Input/Input';
export {
  default as NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper
} from './components/NumberInput/NumberInput';
export { default as Select } from './components/Select/Select';
export { default as SelectImages } from './components/SelectImages/SelectImages';
export { default as SubmitButton } from './components/SubmitButton/SubmitButton';
export { default as Textarea } from './components/Textarea/Textarea';
