import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {
  render,
  screen,
  setTestUser,
  waitFor
} from '../../../../../utils/testing/test-utils';
import SelectImages from './SelectImages';
import { Form, FORM_CONTEXT_ERROR } from '../../Form';
import { expectAllToBeInDocument } from '../../../../../utils/testing/helpers';

describe('SelectImages', () => {
  beforeEach(() => {
    setTestUser(undefined);
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => jest.clearAllMocks());

  const TESTING_LABEL = 'testing-label';
  const STATE_KEY = 'testingSelectImages';

  it('renders the label for the SelectImages field', () => {
    render(
      <Form>
        <SelectImages
          stateKey={STATE_KEY}
          label={TESTING_LABEL}
          max={4}
        ></SelectImages>
      </Form>
    );
    const { getByLabelText } = screen;
    expect(getByLabelText(TESTING_LABEL)).toBeInTheDocument();
  });

  it('should allow user to upload single or multiple files', async () => {
    render(
      <Form>
        <SelectImages
          stateKey={STATE_KEY}
          label={TESTING_LABEL}
          max={4}
        ></SelectImages>
      </Form>
    );
    const { getByLabelText } = screen;
    const user = userEvent.setup();

    const fileA = new File(['file-a'], 'file-a.png', { type: 'image/png' });
    const fileB = new File(['file-b'], 'file-b.png', { type: 'image/png' });
    const fileC = new File(['file-c'], 'file-c.png', { type: 'image/png' });

    const input = getByLabelText(TESTING_LABEL) as HTMLInputElement;

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
    const childrenText = 'child is not a function';
    render(
      <Form>
        <SelectImages stateKey={STATE_KEY} label={TESTING_LABEL} max={4}>
          <div>{childrenText}</div>
        </SelectImages>
      </Form>
    );
    const { getByText } = screen;
    expect(getByText(childrenText)).toBeInTheDocument();
  });

  it('correctly renders the result of the children if it is a function', () => {
    const childrenText = 'child is not a function';
    render(
      <Form>
        <SelectImages stateKey={STATE_KEY} label={TESTING_LABEL} max={4}>
          {() => <div>{childrenText}</div>}
        </SelectImages>
      </Form>
    );
    const { getByText } = screen;
    expect(getByText(childrenText)).toBeInTheDocument();
  });

  it('correctly renders the result of the children if it is a function and bases rendering on form state, and allows removing of items', async () => {
    const childrenText = 'child is a function';
    const component = (
      <Form>
        <SelectImages<typeof STATE_KEY>
          stateKey={STATE_KEY}
          label={TESTING_LABEL}
          max={4}
        >
          {(state, onRemove) => {
            if (!state) return null;
            const { testingSelectImages } = { ...state };
            return (
              <>
                <div>{childrenText}</div>
                {testingSelectImages.map((image, i) => (
                  <div key={i}>
                    <span>{image.name}</span>
                    <button
                      onClick={() => onRemove(i)}
                    >{`remove-${image.name}`}</button>
                  </div>
                ))}
              </>
            );
          }}
        </SelectImages>
      </Form>
    );
    render(component);
    const { getByText, getByLabelText, queryByText } = screen;
    const user = userEvent.setup();
    const fileA = new File(['file-a'], 'file-a.png', {
      type: 'image/png'
    });
    const fileB = new File(['file-b'], 'file-b.png', {
      type: 'image/png'
    });
    const fileC = new File(['file-c'], 'file-c.png', {
      type: 'image/png'
    });
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

  it('does not render outside of the Form component', () => {
    try {
      render(<SelectImages stateKey={STATE_KEY} max={4}></SelectImages>);
    } catch (err: any) {
      expect(err.message).toEqual(FORM_CONTEXT_ERROR);
    }
  });
});
