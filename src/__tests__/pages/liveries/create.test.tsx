import '@testing-library/jest-dom';
import { render, screen } from '../../../utils/testing/test-utils';
import Create from '../../../pages/liveries/create';
import { commonStrings, liveryStrings } from '../../../utils/intl';

const testCar = {
  id: '0',
  class: 'GT4',
  name: 'Aston Martin V8 Vantage GT4'
};

describe('Create livery', () => {
  it('renders a heading, submit and cancel buttons', async () => {
    render(<Create car={{ ids: ['0'], cars: { '0': testCar } }} />);
    expect(
      screen.getAllByText(liveryStrings.uploadHeading.defaultMessage)
    ).toHaveLength(2);
    expect(
      screen.getByText(liveryStrings.uploadSummary.defaultMessage)
    ).toBeInTheDocument();
    expect(
      screen.getByText(liveryStrings.uploadLivery.defaultMessage, {
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
