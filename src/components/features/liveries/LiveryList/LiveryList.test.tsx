import '@testing-library/jest-dom';
import {
  render,
  screen,
  setMockCurrentUser
} from '../../../../utils/testing/test-utils';
import data from '../../../../utils/dev-data/liveries.json';

import LiveryList from './LiveryList';
import { LiveryDataType } from '../../../../types';

describe('LiverCard', () => {
  beforeEach(() => {
    setMockCurrentUser({ token: null, data: null, status: 'idle' });
  });

  const dataCopy = [...data];
  dataCopy.length = 10;
  const liveryData = dataCopy.reduce(
    (prev, cur: any) => {
      prev.ids.push(cur.id);
      cur.deleted = false;
      prev.entities[cur.id] = cur;
      return prev;
    },
    {
      ids: [],
      entities: {}
    } as { ids: string[]; entities: Record<string, LiveryDataType> }
  );

  it('renders a list of liveries', () => {
    render(<LiveryList liveries={liveryData} />);
    dataCopy.forEach((livery) => {
      const {
        title,
        car,
        creator: { displayName }
      } = livery;
      expect(screen.getAllByText(title).length).toBeGreaterThan(0);
      expect(screen.getAllByText(car).length).toBeGreaterThan(0);
      expect(screen.getAllByText(displayName).length).toBeGreaterThan(0);
    });
  });
});
