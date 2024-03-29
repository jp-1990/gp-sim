import {
  FormValueType,
  FormStateType,
  FormStatusType,
  SetFormStatusType,
  FormDefaultStateType
} from '../types';
import { IsFieldValidReturnType } from './validation';

/**
 * @param setState - setState to set form state
 * @param stateKey - string key to use to index state
 * @returns onChange function to handle input element onChange event
 */
export const defaultOnChange =
  <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    setState: React.Dispatch<React.SetStateAction<FormValueType['state']>>,
    stateKey: string
  ) =>
  (event: React.ChangeEvent<T>) => {
    const { value } = event.target;
    setState((prev) => {
      const prevState = { ...prev };
      prevState[stateKey] = value;
      return prevState;
    });
  };

/**
 * @param setState - setState to set form state
 * @param stateKey - string key to use to index state
 * @returns onChange function to handle Checkbox element onChange event
 */
export const checkboxOnChange =
  <T extends HTMLInputElement>(
    setState: React.Dispatch<React.SetStateAction<FormValueType['state']>>,
    stateKey: string
  ) =>
  (event: React.ChangeEvent<T>) => {
    const { checked } = event.target;
    setState((prev) => {
      const prevState = { ...prev };
      prevState[stateKey] = checked;
      return prevState;
    });
  };

/**
 * @param setState - setState to set form state
 * @param stateKey - string key to use to index state
 * @returns onChange function to handle NumberInput element onChange event
 */
export const numberInputOnChange =
  (
    setState: React.Dispatch<React.SetStateAction<FormValueType['state']>>,
    stateKey: string
  ) =>
  (value: string | number) => {
    setState((prev) => {
      const prevState = { ...prev };
      prevState[stateKey] = value;
      return prevState;
    });
  };

/**
 * @param setState - setState to set form state
 * @param stateKey - string key to use to index state
 * @returns onChange function to handle input element onChange event
 */
export const tagsOnChange =
  <T extends HTMLInputElement>(
    setState: React.Dispatch<React.SetStateAction<FormValueType['state']>>,
    stateKey: string
  ) =>
  (event: React.ChangeEvent<T>) => {
    const { value } = event.target;
    setState((prev) => {
      const prevState = { ...prev };
      prevState[stateKey] = value;
      return prevState;
    });
  };

/**
 * @param setState - setState to set form state
 * @param stateKey - string key to use to index state
 * @param max - number maximum number of images
 * @returns onChange function to handle SelectFiles element onChange event
 */
export const selectFilesOnChange =
  (
    setState: React.Dispatch<React.SetStateAction<FormValueType['state']>>,
    stateKey: string,
    max: number | undefined
  ) =>
  (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    const newFiles = Array.from(event.target.files);
    setState((prev) => {
      const prevState = { ...prev };
      const files = newFiles.filter(
        (file) => !prevState[stateKey].find((e: any) => e.name === file.name)
      );
      if (!files.length) return prevState;
      const newState = [...prevState[stateKey]];
      newState.push(...files);
      if (max && newState.length > max) newState.length = max;
      prevState[stateKey] = newState;
      return prevState;
    });
  };

/**
 * @param setState - setState to set form state
 * @param stateKey - string key to use to index state
 * @param max - number maximum number of images
 * @returns onChange function to handle SelectFiles element onChange event
 */
export const selectFilesRemoveByIndex =
  (
    setState: React.Dispatch<React.SetStateAction<FormValueType['state']>>,
    stateKey: string,
    max: number | undefined
  ) =>
  (index: number) => {
    if (max && index > max) return;
    setState((prev) => {
      const prevState = { ...prev };
      const newState = [...prevState[stateKey]];
      newState.splice(index, 1);
      if (max && newState.length > max) newState.length = max;
      prevState[stateKey] = newState;
      return prevState;
    });
  };

/**
 *
 * @param setState - setState to set form state
 * @returns function which accepts a status key for form state and a boolean value to set to that key.
 */
export const setFormStatus =
  (setState: FormValueType['setState']) =>
  (
    status: keyof Omit<FormStatusType, 'validators' | 'invalidFields'>,
    value: boolean
  ) =>
    setState((prev) => {
      const nextState = { ...prev };
      nextState[status] = value;
      return nextState;
    });

/**
 *
 * @param state - form state
 * @param onClick - function which should accept state as a single argument
 * @returns onClick function to provide to SubmitButton onClick event
 */
export const submitButtonSubmitForm =
  <T extends FormDefaultStateType>(
    state: FormStateType<T>,
    setFormStatus: SetFormStatusType,
    onClick: (
      state: FormStateType<T>,
      setFormStatus?: SetFormStatusType
    ) => void
  ) =>
  () =>
    onClick(state, setFormStatus);

/**
 * Intended to be used to add validators for form fields to state, to be looped over and called when form submit is fired
 * @param validator - function which should internally call a validator function and return the IsFieldValidReturnType
 * @param setState - setState to set form state
 */
export const formAddValidator = (
  validator: () => IsFieldValidReturnType,
  setState: FormValueType['setState']
) => {
  setState((_prev) => {
    const prev = { ..._prev };
    prev.validators = [...prev.validators, validator];
    return prev;
  });
};

/**
 * Intended to be used on submit to validate all fields in the form
 * @param validators - array of functions to validate form state
 * @returns boolean
 */
export const isFormStateValid = (
  validators: (() => IsFieldValidReturnType)[]
) => {
  return validators.reduce((prev, cur) => {
    if (prev === false) return prev;
    const { valid } = cur();
    return valid;
  }, true as boolean);
};

/**
 *
 * @param stateKey - string key to use to index state
 * @param setState - setState to set form state
 */
export const addToInvalidFields = (
  stateKey: string,
  setState: FormValueType['setState']
) => {
  if (!stateKey) return;
  setState((_prev) => {
    const prev = { ..._prev };
    const invalidFields = [...prev.invalidFields];
    if (!invalidFields.includes(stateKey)) invalidFields.push(stateKey);
    prev.invalidFields = invalidFields;
    return prev;
  });
};

/**
 *
 * @param stateKey - string key to use to index state
 * @param setState - setState to set form state
 */
export const removeFromInvalidFields = (
  stateKey: string,
  setState: FormValueType['setState']
) => {
  if (!stateKey) return;
  setState((_prev) => {
    const prev = { ..._prev };
    const invalidFields = [...prev.invalidFields];
    if (invalidFields.includes(stateKey)) {
      prev.invalidFields = invalidFields.filter((el) => el !== stateKey);
    }
    return prev;
  });
};

/**
 * Used to reset the value field on the clicked element. Useful for ensuring onChange will fire when the user expects it to.
 * @param event - React MouseEvent
 */
export const setInputTargetValueToEmptyString = (event: React.MouseEvent) =>
  ((event.target as HTMLInputElement).value = '');
