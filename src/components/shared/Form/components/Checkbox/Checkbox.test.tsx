import '@testing-library/jest-dom';
import { render, setTestUser } from '../../../../../utils/testing/test-utils';
import Checkbox from './Checkbox';
import { FORM_CONTEXT_ERROR } from '../../Form';

describe('Checkbox', () => {
  beforeEach(() => {
    setTestUser(undefined);
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => jest.clearAllMocks());

  const STATE_KEY = 'testingCheckbox';

  it('does not render outside of the Form component', () => {
    try {
      render(<Checkbox stateKey={STATE_KEY}></Checkbox>);
    } catch (err: any) {
      expect(err.message).toEqual(FORM_CONTEXT_ERROR);
    }
  });
});
