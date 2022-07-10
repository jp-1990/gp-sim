import '@testing-library/jest-dom';
import { render, screen, waitFor } from '../../../utils/testing/test-utils';
import Profile from '../../../pages/profile/[id]';
import { commonStrings, profileStrings } from '../../../utils/intl';
import userEvent from '@testing-library/user-event';

const tabNames = {
  profile: commonStrings.profile.defaultMessage,
  liveries: commonStrings.liveries.defaultMessage
};

describe('Profile', () => {
  it('renders the profile header and summary', async () => {
    render(<Profile id="0" />);

    expect(
      screen.getAllByText(profileStrings.profileHeading.defaultMessage)
    ).toHaveLength(4);
    expect(
      screen.getByText(profileStrings.profileSummary.defaultMessage)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('tab', { name: tabNames.profile })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: tabNames.liveries })
    ).toBeInTheDocument();
  });

  it('renders with the profile tab selected, and correctly selects liveries', async () => {
    render(<Profile id="0" />);
    const user = userEvent.setup();

    await waitFor(() =>
      expect(
        screen.getByRole('tab', { name: tabNames.profile })
      ).toBeInTheDocument()
    );
    expect(
      screen.getByRole('tab', { name: tabNames.liveries })
    ).toBeInTheDocument();

    const profileTab = screen.getByRole('tab', {
      name: tabNames.profile
    });
    const liveriesTab = screen.getByRole('tab', { name: tabNames.liveries });

    expect(profileTab).toBeInTheDocument();
    expect(liveriesTab).toBeInTheDocument();

    expect(profileTab).toHaveAttribute('aria-selected', 'true');
    expect(liveriesTab).toHaveAttribute('aria-selected', 'false');

    await user.click(liveriesTab);

    expect(profileTab).toHaveAttribute('aria-selected', 'false');
    expect(liveriesTab).toHaveAttribute('aria-selected', 'true');
  });
});
