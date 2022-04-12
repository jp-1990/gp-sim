import '@testing-library/jest-dom';
import { render, screen, setTestUser } from '../../../utils/testing/test-utils';
import Rating, { FILLED_STAR, DEFAULT_STAR } from './Rating';

describe('LiverCard', () => {
  beforeEach(() => {
    setTestUser(undefined);
  });

  it('renders 5 stars', () => {
    render(<Rating rating={0} />);
    const { queryAllByTestId } = screen;
    expect(queryAllByTestId(DEFAULT_STAR)).toHaveLength(5);
    expect(queryAllByTestId(FILLED_STAR)).toHaveLength(0);
  });

  it('renders the correct number of stars in each color based on rating prop', () => {
    render(<Rating rating={3} />);
    const { queryAllByTestId } = screen;
    expect(queryAllByTestId(DEFAULT_STAR)).toHaveLength(2);
    expect(queryAllByTestId(FILLED_STAR)).toHaveLength(3);
  });
});
