import '@testing-library/jest-dom';
import { render, screen, setTestUser } from '../../../utils/testing/test-utils';
import Tag from './Tag';

describe('Tag', () => {
  beforeEach(() => {
    setTestUser(undefined);
  });

  it('renders the tag', () => {
    const tag = 'tag-0';
    render(<Tag tag={tag} />);
    expect(screen.getByText(tag)).toBeInTheDocument();
  });
});
