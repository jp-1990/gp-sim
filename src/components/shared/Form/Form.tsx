import React, { useState } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
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

  /**
   * A convenience wrapper for setState, which makes a deep copy of existing state using lodash _cloneDeep, which is then passed into the provided callback as state. This allows direct mutations to be made within the callback function, which should then return the state.
   * @param callback - function which should accept state as an argument, and return state.
   */
  const setStateImmutably = (
    callback: (formState: typeof state) => typeof state
  ) => {
    setState((prev) => {
      const prevState = _cloneDeep(prev);
      const newState = callback(prevState);
      return newState;
    });
  };

  const value = { state, setState, setStateImmutably };
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
export { default as SelectFiles } from './components/SelectFiles/SelectFiles';
export { default as SubmitButton } from './components/SubmitButton/SubmitButton';
export { default as Tags } from './components/Tags/Tags';
export { default as Textarea } from './components/Textarea/Textarea';
