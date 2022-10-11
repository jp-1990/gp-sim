import '@testing-library/jest-dom';
import {
  render,
  screen,
  setMockCurrentUser
} from '../../../utils/testing/test-utils';
import Tag from './Tag';

describe('Tag', () => {
  beforeEach(() => {
    setMockCurrentUser({ token: null, data: null, status: 'idle' });
  });

  it('renders the tag', () => {
    const tag = 'tag-0';
    render(<Tag tag={tag} />);
    expect(screen.getByText(tag)).toBeInTheDocument();
  });
});
