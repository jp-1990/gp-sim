import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  setMockCurrentUser
} from '../../../../../utils/testing/test-utils';
import Input from './Input';
import { Form, FORM_CONTEXT_ERROR } from '../../Form';

describe('Input', () => {
  beforeEach(() => {
    setMockCurrentUser({ token: null, data: null, status: 'idle' });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => jest.clearAllMocks());

  const TESTING_LABEL = 'testing-label';
  const STATE_KEY = 'testingInput';
  it('renders the label for the input field', () => {
    render(
      <Form>
        <Input stateKey={STATE_KEY} label={TESTING_LABEL} />
      </Form>
    );
    const { getByLabelText } = screen;
    expect(getByLabelText(TESTING_LABEL)).toBeInTheDocument();
  });

  it('renders the user input in the input field', () => {
    render(
      <Form>
        <Input stateKey={STATE_KEY} label={TESTING_LABEL} />
      </Form>
    );
    const { getByLabelText, queryByDisplayValue } = screen;
    const input = 'on-change';
    expect(queryByDisplayValue(input)).not.toBeInTheDocument();
    fireEvent.change(getByLabelText(TESTING_LABEL), {
      target: { value: input }
    });
    expect(queryByDisplayValue(input)).toBeInTheDocument();
  });

  it('does not render outside of the Form component', () => {
    try {
      render(<Input stateKey={STATE_KEY} />);
    } catch (err: any) {
      expect(err.message).toEqual(FORM_CONTEXT_ERROR);
    }
  });
});
