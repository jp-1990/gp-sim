import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {
  render,
  screen,
  setMockCurrentUser,
  waitFor
} from '../../../../../utils/testing/test-utils';
import SelectFiles from './SelectFiles';
import { Form, FORM_CONTEXT_ERROR } from '../../Form';
import { expectAllToBeInDocument } from '../../../../../utils/testing/helpers';

describe('SelectFiles', () => {
  beforeEach(() => {
    setMockCurrentUser({ token: null, data: null, status: 'idle' });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => jest.clearAllMocks());

  const TESTING_LABEL = 'testing-label';
  const STATE_KEY = 'testingSelectFiles';

  const fileA = new File(['file-a'], 'file-a.txt', { type: 'text/plain' });
  const fileB = new File(['file-b'], 'file-b.txt', { type: 'text/plain' });
  const fileC = new File(['file-c'], 'file-c.txt', { type: 'text/plain' });

  it('renders the label for the SelectFiles field', () => {
    render(
      <Form>
        <SelectFiles stateKey={STATE_KEY} label={TESTING_LABEL}></SelectFiles>
      </Form>
    );
    expect(screen.getByLabelText(TESTING_LABEL)).toBeInTheDocument();
  });

  it('renders the helper text for the SelectFiles field', () => {
    render(
      <Form>
        <SelectFiles
          stateKey={STATE_KEY}
          helperText={TESTING_LABEL}
        ></SelectFiles>
      </Form>
    );
    expect(screen.getByText(TESTING_LABEL)).toBeInTheDocument();
  });

  it('should allow user to select single or multiple files', async () => {
    render(
      <Form>
        <SelectFiles stateKey={STATE_KEY} label={TESTING_LABEL}></SelectFiles>
      </Form>
    );
    const user = userEvent.setup();

    const input = screen.getByLabelText(TESTING_LABEL) as HTMLInputElement;

    expect(input).toBeInTheDocument();
    await user.upload(input, fileA);

    expect(input.files?.item(0)).toBe(fileA);
    expect(input.files).toHaveLength(1);

    await user.upload(input, [fileA, fileB, fileC]);

    expect(input.files?.item(0)).toBe(fileA);
    expect(input.files?.item(1)).toBe(fileB);
    expect(input.files?.item(2)).toBe(fileC);

    expect(input.files).toHaveLength(3);
  });

  it('correctly renders the result of the children if it is a ReactNode', () => {
    const childrenText = 'child is a ReactNode';
    render(
      <Form>
        <SelectFiles stateKey={STATE_KEY} label={TESTING_LABEL}>
          <div>{childrenText}</div>
        </SelectFiles>
      </Form>
    );
    expect(screen.getByText(childrenText)).toBeInTheDocument();
  });

  it('correctly renders the result of the children if it is a function', () => {
    const childrenText = 'child is a function';
    render(
      <Form>
        <SelectFiles stateKey={STATE_KEY} label={TESTING_LABEL}>
          {() => <div>{childrenText}</div>}
        </SelectFiles>
      </Form>
    );
    const { getByText } = screen;
    expect(getByText(childrenText)).toBeInTheDocument();
  });

  it('correctly renders the result of the children if it is a function and bases rendering on form state, and allows removing of items', async () => {
    const childrenText = 'child is a function';
    const component = (
      <Form>
        <SelectFiles<typeof STATE_KEY>
          stateKey={STATE_KEY}
          label={TESTING_LABEL}
        >
          {(state, onRemove) => {
            if (!state) return null;
            const { testingSelectFiles } = { ...state };
            return (
              <>
                <div>{childrenText}</div>
                {testingSelectFiles.map((file, i) => (
                  <div key={i}>
                    <span>{file.name}</span>
                    <button
                      onClick={() => onRemove(i)}
                    >{`remove-${file.name}`}</button>
                  </div>
                ))}
              </>
            );
          }}
        </SelectFiles>
      </Form>
    );
    render(component);
    const { getByText, getByLabelText, queryByText } = screen;
    const user = userEvent.setup();

    await waitFor(async () => {
      expect(getByText(childrenText)).toBeInTheDocument();

      const input = getByLabelText(TESTING_LABEL) as HTMLInputElement;
      expect(input).toBeInTheDocument();

      await user.upload(input, [fileA, fileB, fileC]);
      expectAllToBeInDocument([fileA.name, fileB.name, fileC.name]);
    });
    const removeImageA = getByText(`remove-${fileA.name}`);
    await user.click(removeImageA);
    expect(queryByText(fileA.name)).not.toBeInTheDocument();

    const removeImageB = getByText(`remove-${fileB.name}`);
    await user.click(removeImageB);
    expect(queryByText(fileB.name)).not.toBeInTheDocument();

    const removeImageC = getByText(`remove-${fileC.name}`);
    await user.click(removeImageC);
    expect(queryByText(fileC.name)).not.toBeInTheDocument();
  });

  it('correctly renders the result of the children if it is a function and bases rendering on form state, will not allow more than max items', async () => {
    const component = (
      <Form>
        <SelectFiles<typeof STATE_KEY>
          stateKey={STATE_KEY}
          label={TESTING_LABEL}
          max={2}
        >
          {(state) => {
            if (!state) return null;
            const { testingSelectFiles } = { ...state };
            return (
              <>
                {testingSelectFiles.map((file, i) => (
                  <div key={i}>{file.name}</div>
                ))}
              </>
            );
          }}
        </SelectFiles>
      </Form>
    );
    render(component);
    const user = userEvent.setup();

    await waitFor(async () => {
      const input = screen.getByLabelText(TESTING_LABEL) as HTMLInputElement;
      expect(input).toBeInTheDocument();

      await user.upload(input, [fileA, fileB, fileC]);
      expectAllToBeInDocument([fileA.name, fileB.name]);
      expect(screen.queryByText(fileC.name)).not.toBeInTheDocument();
    });
  });

  it('does not render outside of the Form component', () => {
    try {
      render(<SelectFiles stateKey={STATE_KEY} max={4}></SelectFiles>);
    } catch (err: any) {
      expect(err.message).toEqual(FORM_CONTEXT_ERROR);
    }
  });
});
