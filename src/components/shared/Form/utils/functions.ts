import {
  FormValueType,
  FormStateType,
  FormStatusType,
  SetFormStatusType
} from '../types';

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
 * @param max - number maximum number of images
 * @returns onChange function to handle SelectImages element onChange event
 */
export const selectImagesOnChange =
  (
    setState: React.Dispatch<React.SetStateAction<FormValueType['state']>>,
    stateKey: string,
    max: number
  ) =>
  (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    const files = Array.from(event.target.files);
    setState((prev) => {
      const prevState = { ...prev };
      const newState = [...prevState[stateKey]];
      newState.push(...files);
      if (newState.length > max) newState.length = max;
      prevState[stateKey] = newState;
      return prevState;
    });
  };

/**
 * @param setState - setState to set form state
 * @param stateKey - string key to use to index state
 * @param max - number maximum number of images
 * @returns onChange function to handle SelectImages element onChange event
 */
export const selectImagesRemoveByIndex =
  (
    setState: React.Dispatch<React.SetStateAction<FormValueType['state']>>,
    stateKey: string,
    max: number
  ) =>
  (index: number) => {
    if (index > max) return;
    setState((prev) => {
      const prevState = { ...prev };

      const newState = [...prevState[stateKey]];

      newState.splice(index, 1);
      if (newState.length > max) newState.length = max;
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
  (status: keyof FormStatusType, value: boolean) =>
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
  (
    state: FormStateType,
    setFormStatus: SetFormStatusType,
    onClick: (state: FormStateType, setFormStatus: SetFormStatusType) => void
  ) =>
  () =>
    onClick(state, setFormStatus);
