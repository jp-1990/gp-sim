import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {
  render,
  screen,
  setTestUser,
  waitFor
} from '../../../../../utils/testing/test-utils';
import Tags from './Tags';
import { Form, FORM_CONTEXT_ERROR } from '../../Form';

describe('Tags', () => {
  beforeEach(() => {
    setTestUser(undefined);
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => jest.clearAllMocks());

  const TESTING_LABEL = 'testing-label';
  const STATE_KEY = 'testingTags';
  it('renders the label for the Tags field', () => {
    render(
      <Form>
        <Tags<'tags'> stateKey={STATE_KEY} label={TESTING_LABEL} />
      </Form>
    );
    expect(screen.getByLabelText(TESTING_LABEL)).toBeInTheDocument();
  });

  it('renders the helper text for the Tags field', () => {
    render(
      <Form>
        <Tags<'tags'> stateKey={STATE_KEY} helperText={TESTING_LABEL} />
      </Form>
    );
    expect(screen.getByText(TESTING_LABEL)).toBeInTheDocument();
  });

  it('correctly renders the result of the children if it is a ReactNode', () => {
    const childrenText = 'child is a reactnode';
    render(
      <Form>
        <Tags<'tags'> stateKey={STATE_KEY} label={TESTING_LABEL}>
          {childrenText}
        </Tags>
      </Form>
    );
    expect(screen.getByText(childrenText)).toBeInTheDocument();
  });

  it('correctly renders the result of the children if it is a function', () => {
    const childrenText = 'child is a function';
    render(
      <Form>
        <Tags<'tags'> stateKey={STATE_KEY} label={TESTING_LABEL}>
          {() => childrenText}
        </Tags>
      </Form>
    );
    expect(screen.getByText(childrenText)).toBeInTheDocument();
  });

  it('correctly renders the result of the children if it is a function and bases rendering on form state', async () => {
    const inputText = 'child is a function';
    render(
      <Form>
        <Tags<typeof STATE_KEY> stateKey={STATE_KEY} label={TESTING_LABEL}>
          {(state) => {
            if (!state) return null;
            return <div>{state[STATE_KEY]}</div>;
          }}
        </Tags>
      </Form>
    );
    const user = userEvent.setup();
    const input = screen.getByLabelText(TESTING_LABEL);
    expect(input).toBeInTheDocument();
    user.type(input, inputText);
    await waitFor(async () => {
      expect(screen.getByDisplayValue(inputText)).toBeInTheDocument();
    });
  });

  it('does not render outside of the Form component', () => {
    try {
      render(<Tags stateKey={STATE_KEY} />);
    } catch (err: any) {
      expect(err.message).toEqual(FORM_CONTEXT_ERROR);
    }
  });
});
