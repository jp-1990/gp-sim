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
  setStateImmutably: (
    callback: (formState: FormStateType) => FormStateType
  ) => void;
}

export type StateWithStateKey<T extends string, K> = FormValueType['state'] &
  Record<T, K>;

export const isStateWithStateKey = <T extends string, K>(
  state: FormValueType['state'],
  stateKey: string
): state is StateWithStateKey<T, K> => {
  return (state as StateWithStateKey<T, K>)[stateKey] !== undefined;
};
