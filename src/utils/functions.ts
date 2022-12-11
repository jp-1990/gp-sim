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
  const pendingCallback = (state: T) => {
    state.error = null;
    state.status = RequestStatus.PENDING;
  };

  const rejectedCallback = (state: T, action: { error: SerializedError }) => {
    state.error = action.error.message ?? 'something went wrong';
    state.status = RequestStatus.REJECTED;
  };

  return [pendingCallback, rejectedCallback] as const;
};
