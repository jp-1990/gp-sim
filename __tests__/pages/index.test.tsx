import '@testing-library/jest-dom';
import { render, screen } from '../../utils/testing/test-utils';
import Home from '../../pages/index';

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', {
      name: /welcome to next\.js!/i
    });

    expect(heading).toBeInTheDocument();
  });
});
