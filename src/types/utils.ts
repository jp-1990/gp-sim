export type KeyValueUnionOf<T> = {
  [K in keyof T]: { key: K; value: T[K] };
}[keyof {
  [K in keyof T]: { key: K; value: T[K] };
}];
