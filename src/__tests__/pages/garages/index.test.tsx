import '@testing-library/jest-dom';
import { render, screen, waitFor } from '../../../utils/testing/test-utils';
import Garages from '../../../pages/garages/index';
import liveriesData from '../../../utils/dev-data/liveries.json';
import garagesData from '../../../utils/dev-data/garages.json';
import usersData from '../../../utils/dev-data/users.json';

const userData = usersData[0];
const userGarages = userData.garages;
const userLiveries = userData.liveries;

const userLiveriesData = [...liveriesData].filter(({ id }) =>
  userLiveries.includes(id)
);
const userGaragesData = [...garagesData].filter(({ id }) =>
  userGarages.includes(id)
);

describe('Garages', () => {
  it('renders the garages and liveries from the user collection', async () => {
    render(<Garages />);

    await waitFor(() => {
      userGaragesData.forEach((garage) => {
        expect(screen.getAllByText(garage.creator.displayName)).toBeTruthy();
        expect(screen.getAllByText(garage.title)).toBeTruthy();
      });
      userLiveriesData.forEach((livery) => {
        expect(screen.getAllByText(livery.creator.displayName)).toBeTruthy();
        expect(screen.getAllByText(livery.title)).toBeTruthy();
      });
    });
  });
});
