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
