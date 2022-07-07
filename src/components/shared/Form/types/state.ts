export interface FormStatusType {
  loading: boolean;
  error: boolean;
  invalidFields: string[];
}
export type SetFormStatusType = (
  status: keyof Omit<FormStatusType, 'invalidFields'>,
  value: boolean
) => void;

export type FormDefaultStateType = Record<string | number | symbol, any>;
export type FormInitialStateType = FormStatusType;
export type FormStateType<
  T extends FormDefaultStateType = FormDefaultStateType
> = FormInitialStateType & T;

export type SetStateImmutablyCallbackType<T> = (
  formState: FormStateType<T>
) => FormStateType<T> | void;

export interface FormValueType<
  T extends FormDefaultStateType = FormDefaultStateType
> {
  state: FormStateType<T>;
  setState: React.Dispatch<React.SetStateAction<FormStateType<T>>>;
  setStateImmutably: (callback: SetStateImmutablyCallbackType<T>) => void;
  resetState: (initialState: FormStateType<FormDefaultStateType>) => void;
}

export type StateWithStateKey<
  T extends string,
  K
> = FormValueType<FormDefaultStateType>['state'] & Record<T, K>;

export const isStateWithStateKey = <T extends string, K>(
  state: FormValueType<FormDefaultStateType>['state'],
  stateKey: string
): state is StateWithStateKey<T, K> => {
  return (state as StateWithStateKey<T, K>)[stateKey] !== undefined;
};
