import '@testing-library/jest-dom';
import {
  render,
  screen,
  setMockCurrentUser
} from '../../../../../utils/testing/test-utils';
import userEvent from '@testing-library/user-event';

import SubmitButton from './SubmitButton';
import { Form, initialFormState, FORM_CONTEXT_ERROR } from '../../Form';

describe('SubmitButton', () => {
  beforeEach(() => {
    setMockCurrentUser({ token: null, data: null, status: 'idle' });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => jest.clearAllMocks());

  const TESTING_TEXT = 'testing-label';
  it('renders the text on the button', () => {
    render(
      <Form>
        <SubmitButton onClick={() => null}>{TESTING_TEXT}</SubmitButton>
      </Form>
    );
    expect(screen.getByText(TESTING_TEXT)).toBeInTheDocument();
  });

  it('fires the provided function onClick', async () => {
    const user = userEvent.setup();
    const onClickMock = jest.fn();
    render(
      <Form>
        <SubmitButton onClick={onClickMock}>{TESTING_TEXT}</SubmitButton>
      </Form>
    );
    const button = screen.getByRole('button');
    expect(screen.getByText(TESTING_TEXT)).toBeInTheDocument();
    await user.click(button);
    expect(onClickMock).toHaveBeenCalledWith(
      initialFormState,
      expect.anything()
    );
  });

  it('fires the provided function onClick which can adjust form status to loading', async () => {
    const user = userEvent.setup();
    const onClickMock = jest.fn((_, setFormStatus) => {
      setFormStatus('loading', true);
    });
    render(
      <Form>
        <SubmitButton onClick={onClickMock}>{TESTING_TEXT}</SubmitButton>
      </Form>
    );
    const button = screen.getByRole('button');
    expect(screen.getByText(TESTING_TEXT)).toBeInTheDocument();
    await user.click(button);
    expect(onClickMock).toHaveBeenCalledWith(
      initialFormState,
      expect.anything()
    );
    expect(screen.queryByText(TESTING_TEXT)).not.toBeInTheDocument();
  });

  it('fires the provided function onClick which can adjust form status error to disable submit', async () => {
    const user = userEvent.setup();
    const onClickMock = jest.fn((_, setFormStatus) => {
      setFormStatus('error', true);
    });
    render(
      <Form>
        <SubmitButton onClick={onClickMock}>{TESTING_TEXT}</SubmitButton>
      </Form>
    );
    const button = screen.getByRole('button');
    expect(screen.getByText(TESTING_TEXT)).toBeInTheDocument();
    await user.click(button);
    expect(onClickMock).toHaveBeenCalledWith(
      initialFormState,
      expect.anything()
    );
    expect(screen.queryByText(TESTING_TEXT)).toBeInTheDocument();
    await user.click(button);
    expect(button).toBeDisabled();
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('cannot be clicked when loading', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Form>
        <SubmitButton isLoading={true} onClick={onClick}>
          {TESTING_TEXT}
        </SubmitButton>
      </Form>
    );
    const button = screen.getByRole('button');
    expect(screen.queryByText(TESTING_TEXT)).not.toBeInTheDocument();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalledWith(initialFormState);
  });

  it('cannot be clicked when disabled', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Form>
        <SubmitButton isDisabled={true} onClick={onClick}>
          {TESTING_TEXT}
        </SubmitButton>
      </Form>
    );
    const button = screen.getByRole('button');
    expect(screen.queryByText(TESTING_TEXT)).toBeInTheDocument();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not render outside of the Form component', () => {
    try {
      render(<SubmitButton onClick={() => null}>{TESTING_TEXT}</SubmitButton>);
    } catch (err: any) {
      expect(err.message).toEqual(FORM_CONTEXT_ERROR);
    }
  });
});
