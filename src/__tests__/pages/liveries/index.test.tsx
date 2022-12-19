import '@testing-library/jest-dom';
import { render, screen, waitFor } from '../../../utils/testing/test-utils';
import Liveries from '../../../pages/liveries/index';
import data from '../../../utils/dev-data/liveries.json';

const sortedData = [...data].sort((a, b) => {
  const sort = b.createdAt - a.createdAt;
  return sort;
});
const mostRecentLivery = sortedData[0];

describe('Liveries', () => {
  it('renders a livery based on the default filter by created', async () => {
    render(<Liveries />);

    await waitFor(() => {
      expect(
        screen.findAllByText(mostRecentLivery.creator.displayName)
      ).toBeTruthy();
      expect(screen.findAllByText(mostRecentLivery.title)).toBeTruthy();
    });
  });
});
