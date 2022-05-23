import '@testing-library/jest-dom';
import { render, screen, waitFor } from '../../../utils/testing/test-utils';
import Liveries from '../../../pages/liveries/index';
import data from '../../../utils/dev-data/liveries.json';

const sortedData = [...data]
  .sort((a, b) => b.downloads - a.downloads)
  .sort((a, b) => {
    let sort = b.createdAt - a.createdAt;
    if (sort === 0) {
      sort = b.downloads - a.downloads;
    }
    return sort;
  });
const mostRecentLivery = sortedData[0];

describe('Liveries', () => {
  it('renders a livery based on the default filter by created then by downloads', async () => {
    render(<Liveries />);

    await waitFor(() => {
      expect(
        screen.getAllByText(mostRecentLivery.creator.displayName)
      ).toBeTruthy();
      expect(screen.getAllByText(mostRecentLivery.title)).toBeTruthy();
      expect(
        screen.getAllByText(`£${(mostRecentLivery.price / 100).toFixed(2)}`)
      ).toBeTruthy();
    });
  });
});
