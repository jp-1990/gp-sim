import { SerializedError } from '@reduxjs/toolkit';
import { RequestStatus } from '../types';

const currencies = {
  GBP: { symbol: '£' },
  EUR: { symbol: '€' },
  USD: { symbol: '$' }
} as const;

const currencyCodes = Object.keys(currencies) as (keyof typeof currencies)[];

export const numberToPrice = (
  n: number,
  currencyCode: typeof currencyCodes[number] = 'GBP'
) => `${currencies[currencyCode].symbol}${(n / 100).toFixed(2)}`;

export const isString = (str: any): str is string => typeof str === 'string';

export const isNotNullish = <T>(val: T): val is T =>
  val !== null && val !== undefined;

/**
 * Accepts any string. If the string is 'true' or 'false', returns that boolean, otherwise returns undefined
 * @param str - any string
 * @returns boolean | undefined
 */
export const parseStringBoolean = (str: string | undefined) => {
  if (!str) return undefined;
  if (str === 'true') return true;
  if (str === 'false') return false;
  return undefined;
};

export const parsePromiseSettledRes = <T>(
  promiseRes: PromiseSettledResult<T>
) => (promiseRes.status === 'fulfilled' ? promiseRes.value : undefined);

// THUNK UTILS
type MinimalState = {
  error: string | null;
  status: RequestStatus;
};
/**
 * Returns a tuple containing functions to pass to RTK slice extra reducer case callbacks. These expect a state and optional action argument, and directly mutate that state, returning void.
 *
 * [ pendingCallback, rejectedCallback ]
 *
 * Pending sets error to null and status to pending.
 *
 * Rejected sets error to action.error.message or 'something went wrong', and status to rejected.
 */
export const getTypedThunkPendingAndRejectedCallbacks = <
  T extends MinimalState
>() => {
  /**
   * Accepts a 'state' arg, and mutates state.error to null, state.status to 'pending'
   */
  const pendingCallback = (state: T) => {
    state.error = null;
    state.status = RequestStatus.PENDING;
  };

  /**
   * Accepts 'state' and 'action' args. Mutates state.error to action.error.message, state.status to 'rejected'
   */
  const rejectedCallback = (state: T, action: { error: SerializedError }) => {
    state.error = action.error.message ?? 'something went wrong';
    state.status = RequestStatus.REJECTED;
  };

  /**
   * Accepts a 'state' arg. Mutates state.error to null, state.status to 'fulfilled'
   */
  const fulfilledCallback = (state: T) => {
    state.error = null;
    state.status = RequestStatus.FULFILLED;
  };

  return [pendingCallback, rejectedCallback, fulfilledCallback] as const;
};
