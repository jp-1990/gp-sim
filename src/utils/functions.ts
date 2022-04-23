type NormaliseArgs = { id: string }[];
export const normalise = (arr: NormaliseArgs) => {
  const items = arr.reduce((prev, cur) => {
    const output = { ...prev };
    output[cur.id] = cur;
    return output;
  }, {} as Record<string, any>);
  return {
    items,
    ids: Object.keys(items)
  };
};

export const isString = (str: any): str is string => typeof str === 'string';
