import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  setTestUser
} from '../../../../../utils/testing/test-utils';
import NumberInput, {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper
} from './NumberInput';
import { Form, FORM_CONTEXT_ERROR } from '../../Form';

describe('NumberInput', () => {
  beforeEach(() => {
    setTestUser(undefined);
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => jest.clearAllMocks());

  const TESTING_LABEL = 'testing-label';
  const STATE_KEY = 'testingNumberInput';
  it('renders the label for the NumberInput field', () => {
    render(
      <Form>
        <NumberInput stateKey={STATE_KEY} label={TESTING_LABEL}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Form>
    );
    const { getByLabelText } = screen;
    expect(getByLabelText(TESTING_LABEL)).toBeInTheDocument();
  });

  it('renders the user NumberInput in the NumberInput field', () => {
    render(
      <Form>
        <NumberInput stateKey={STATE_KEY} label={TESTING_LABEL}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Form>
    );
    const { queryByDisplayValue, getByRole } = screen;
    const Numberinput = '10.05';
    expect(queryByDisplayValue(Numberinput)).not.toBeInTheDocument();
    fireEvent.change(getByRole(`spinbutton`), {
      target: { value: Numberinput }
    });
    expect(queryByDisplayValue(Numberinput)).toBeInTheDocument();
  });

  it('does not render outside of the Form component', () => {
    try {
      render(<NumberInput stateKey={STATE_KEY} />);
    } catch (err: any) {
      expect(err.message).toEqual(FORM_CONTEXT_ERROR);
    }
  });
});
