import '@testing-library/jest-dom';
import { render, screen, setTestUser } from '../../../utils/testing/test-utils';
import { expectAllToBeInDocument } from '../../../utils/testing/helpers';
import Tags from './Tags';

describe('Tags', () => {
  beforeEach(() => {
    setTestUser(undefined);
  });

  it('renders the tags', () => {
    const tags = ['tag-0', 'tag-1', 'tag-2'];
    render(<Tags tags={tags} />);

    expectAllToBeInDocument(tags);
  });
});
