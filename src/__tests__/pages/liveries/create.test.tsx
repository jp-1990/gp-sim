import '@testing-library/jest-dom';
import { render, screen } from '../../../utils/testing/test-utils';
import Create from '../../../pages/liveries/create';
import { commonStrings, liveryStrings } from '../../../utils/intl';

describe('Create livery', () => {
  it('renders a heading, submit and cancel buttons', async () => {
    render(<Create />);
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
