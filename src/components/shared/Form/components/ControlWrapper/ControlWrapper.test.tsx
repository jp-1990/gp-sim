import '@testing-library/jest-dom';
import {
  render,
  screen,
  setTestUser
} from '../../../../../utils/testing/test-utils';
import ControlWrapper from './ControlWrapper';
import { formStrings } from '../../../../../utils/intl';

describe('ControlWrapper', () => {
  beforeEach(() => {
    setTestUser(undefined);
  });
  afterAll(() => jest.clearAllMocks());

  const TESTING_LABEL = 'testing-label';
  const TESTING_HELPER = 'testing-helper';
  const TESTING_ID = 'test-input';
  it('renders the label and helper text and not the error text when valid', () => {
    render(
      <ControlWrapper
        label={TESTING_LABEL}
        helperText={TESTING_HELPER}
        htmlFor={TESTING_ID}
      >
        <input id={TESTING_ID}></input>
      </ControlWrapper>
    );
    expect(screen.getByLabelText(TESTING_LABEL)).toBeInTheDocument();
    expect(screen.getByText(TESTING_HELPER)).toBeInTheDocument();
    expect(
      screen.queryByText(formStrings.invalidInput.defaultMessage)
    ).not.toBeInTheDocument();
  });

  it('renders the error text and not the helper text when invalid', () => {
    render(
      <ControlWrapper
        label={TESTING_LABEL}
        helperText={TESTING_HELPER}
        htmlFor={TESTING_ID}
        isValid={false}
      >
        <input id={TESTING_ID}></input>
      </ControlWrapper>
    );
    expect(screen.getByLabelText(TESTING_LABEL)).toBeInTheDocument();
    expect(screen.queryByText(TESTING_HELPER)).not.toBeInTheDocument();
    expect(
      screen.getByText(formStrings.invalidInput.defaultMessage)
    ).toBeInTheDocument();
  });
});
