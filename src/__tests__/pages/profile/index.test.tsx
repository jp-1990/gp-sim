import '@testing-library/jest-dom';
import { render, screen, waitFor } from '../../../utils/testing/test-utils';
import Profile from '../../../pages/profile/index';
import { commonStrings, profileStrings } from '../../../utils/intl';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: { tab: 0 },
      asPath: '',
      push: jest.fn()
    };
  }
}));

const tabNames = {
  editProfile: commonStrings.editProfile.defaultMessage,
  liveries: commonStrings.liveries.defaultMessage,
  garages: commonStrings.garages.defaultMessage
};

describe('Profile', () => {
  it('renders the profile header and summary', async () => {
    render(<Profile />);

    expect(
      screen.getAllByText(profileStrings.profileHeading.defaultMessage)
    ).toHaveLength(2);
    expect(
      screen.getByText(profileStrings.profileSummary.defaultMessage)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('tab', { name: tabNames.editProfile })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: tabNames.liveries })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: tabNames.garages })
    ).toBeInTheDocument();
  });

  it('renders with the profile tab selected, and correctly selects liveries and garages', async () => {
    render(<Profile />);
    const user = userEvent.setup();

    await waitFor(() =>
      expect(
        screen.getByRole('tab', { name: tabNames.editProfile })
      ).toBeInTheDocument()
    );
    expect(
      screen.getByRole('tab', { name: tabNames.liveries })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('tab', { name: tabNames.garages })
    ).toBeInTheDocument();

    const profileTab = screen.getByRole('tab', {
      name: tabNames.editProfile
    });
    const liveriesTab = screen.getByRole('tab', { name: tabNames.liveries });
    const garagesTab = screen.getByRole('tab', { name: tabNames.garages });

    expect(profileTab).toBeInTheDocument();
    expect(liveriesTab).toBeInTheDocument();
    expect(garagesTab).toBeInTheDocument();

    expect(profileTab).toHaveAttribute('aria-selected', 'true');
    expect(liveriesTab).toHaveAttribute('aria-selected', 'false');
    expect(garagesTab).toHaveAttribute('aria-selected', 'false');

    await user.click(liveriesTab);

    expect(profileTab).toHaveAttribute('aria-selected', 'false');
    expect(liveriesTab).toHaveAttribute('aria-selected', 'true');
    expect(garagesTab).toHaveAttribute('aria-selected', 'false');

    await user.click(garagesTab);

    expect(profileTab).toHaveAttribute('aria-selected', 'false');
    expect(liveriesTab).toHaveAttribute('aria-selected', 'false');
    expect(garagesTab).toHaveAttribute('aria-selected', 'true');
  });
});
