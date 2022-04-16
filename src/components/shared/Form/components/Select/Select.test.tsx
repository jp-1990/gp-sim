import '@testing-library/jest-dom';
import {
  render,
  screen,
  setTestUser
} from '../../../../../utils/testing/test-utils';
import Select from './Select';
import { Form, FORM_CONTEXT_ERROR } from '../../Form';

describe('Select', () => {
  beforeEach(() => {
    setTestUser(undefined);
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => jest.clearAllMocks());

  const TESTING_LABEL = 'testing-label';
  const STATE_KEY = 'testingSelect';
  it('renders the label for the select field', () => {
    render(
      <Form>
        <Select stateKey={STATE_KEY} label={TESTING_LABEL}>
          <option value="option1">Option 1</option>
        </Select>
      </Form>
    );
    const { getByLabelText } = screen;
    expect(getByLabelText(TESTING_LABEL)).toBeInTheDocument();
  });

  it('does not render outside of the Form component', () => {
    try {
      render(
        <Select stateKey={STATE_KEY}>
          <option value="option1">Option 1</option>
        </Select>
      );
    } catch (err: any) {
      expect(err.message).toEqual(FORM_CONTEXT_ERROR);
    }
  });
});
