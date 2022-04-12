import '@testing-library/jest-dom';
import { render, screen, setTestUser } from '../../../utils/testing/test-utils';
import { expectAllToBeInDocument } from '../../../utils/testing/helpers';
import PageHeading from './PageHeading';

describe('PageHeading', () => {
  beforeEach(() => {
    setTestUser(undefined);
  });

  it('renders a heading and paragraph', () => {
    const heading = 'heading';
    const paragraph = 'paragraph';
    render(<PageHeading heading={heading} paragraph={paragraph} />);

    expectAllToBeInDocument([heading, paragraph]);
  });

  it('renders a heading', () => {
    const heading = 'heading';
    render(<PageHeading heading={heading} />);
    const { queryByText } = screen;
    expect(queryByText(heading)).toBeInTheDocument();
  });
});
