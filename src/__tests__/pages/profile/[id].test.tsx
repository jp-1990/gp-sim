import '@testing-library/jest-dom';
import { render, screen, waitFor } from '../../../utils/testing/test-utils';
import Profile from '../../../pages/profile/[id]';
import usersData from '../../../utils/dev-data/users.json';

const userData = usersData.find((user) => user.id === '0');

describe('Profile', () => {
  it('renders with the user display name based on data', async () => {
    if (!userData) return false;
    render(<Profile id="0" />);
    await waitFor(() => {
      expect(
        screen.queryAllByText(userData.displayName).length
      ).toBeGreaterThan(0);
    });
  });
});
