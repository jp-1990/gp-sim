import { useState } from 'react';

export const useSelectedLiveries = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string | string[]) => {
    if (typeof id === 'object') return setSelected(id);
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((prevId) => id !== prevId);
      return [...prev, id];
    });
  };

  return {
    selected,
    setSelected,
    toggle
  };
};
