import '@testing-library/jest-dom';
import { render, screen } from '../../../utils/testing/test-utils';
import Create from '../../../pages/garages/create';
import { commonStrings, garageStrings } from '../../../utils/intl';

describe('Create garage', () => {
  it('renders a heading, submit and cancel buttons', async () => {
    render(<Create />);
    expect(
      screen.getAllByText(garageStrings.createHeading.defaultMessage)
    ).toHaveLength(1);
    expect(
      screen.getByText(garageStrings.createSummary.defaultMessage)
    ).toBeInTheDocument();
    expect(
      screen.getByText(garageStrings.createGarage.defaultMessage, {
        selector: 'button'
      })
    );
    expect(
      screen.getByText(commonStrings.cancel.defaultMessage, {
        selector: 'button'
      })
    );
  });
});
