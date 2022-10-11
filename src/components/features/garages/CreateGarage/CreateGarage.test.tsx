import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {
  commonStrings,
  formStrings,
  garageStrings
} from '../../../../utils/intl';
import {
  render,
  screen,
  setMockCurrentUser
} from '../../../../utils/testing/test-utils';
import CreateGarage from './CreateGarage';

const formLabels: Record<string, string> = {
  title: formStrings.title.defaultMessage + '*',
  description: formStrings.description.defaultMessage,
  images: commonStrings.selectImage.defaultMessage
};

const imageFiles = [
  new File(['file-a'], 'file-a.png', { type: 'image/png' }),
  new File(['file-b'], 'file-b.jpeg', { type: 'image/jpeg' }),
  new File(['file-c'], 'file-c.webp', { type: 'image/webp' })
];

const buttonText: Record<string, string> = {
  uploadLivery: garageStrings.createGarage.defaultMessage,
  cancel: commonStrings.cancel.defaultMessage
};

const inputValues = {
  title: 'testing title',
  description: 'testing description',
  images: undefined
};

describe('CreateGarage', () => {
  beforeEach(() => {
    setMockCurrentUser({ token: null, data: null, status: 'idle' });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => jest.clearAllMocks());

  describe('renders labels and buttons', () => {
    it('renders the labels for all form fields', () => {
      render(<CreateGarage />);
      for (const label in formLabels) {
        expect(screen.getByLabelText(formLabels[label])).toBeInTheDocument();
      }
    });

    it('renders the submit and cancel buttons', () => {
      render(<CreateGarage />);
      for (const text in buttonText) {
        expect(screen.getByText(buttonText[text])).toBeInTheDocument();
      }
    });
  });

  describe('title field', () => {
    it('correctly renders the title field with and without error', async () => {
      render(<CreateGarage />);
      const user = userEvent.setup();

      const titleInput = screen.getByLabelText(formLabels.title);
      expect(titleInput).toBeInTheDocument();
      expect(titleInput).toBeRequired();

      expect(screen.getAllByRole('status')).toHaveLength(1);

      await user.type(titleInput, inputValues.title);
      expect(screen.queryAllByRole('status')).toHaveLength(0);

      expect(screen.getByDisplayValue(inputValues.title)).toBeInTheDocument();
    });
  });

  describe('description field', () => {
    it('correctly renders the description field', async () => {
      render(<CreateGarage />);
      const user = userEvent.setup();

      const descriptionInput = screen.getByLabelText(formLabels.description);
      expect(descriptionInput).toBeInTheDocument();
      expect(descriptionInput).not.toBeRequired();

      await user.type(descriptionInput, inputValues.description);
      expect(
        screen.getByDisplayValue(inputValues.description)
      ).toBeInTheDocument();
    });
  });

  describe('select images section', () => {
    it('correctly renders the selectImages section with a button and helperText', async () => {
      render(<CreateGarage />);

      expect(screen.getByLabelText(formLabels.images)).toBeInTheDocument();
      expect(
        screen.getByRole('note', {
          name: `${formLabels.images}-helper`
        })
      );
    });

    it('correctly renders the selectImages section with items based on single File input', async () => {
      render(<CreateGarage />);
      const user = userEvent.setup();
      const selectImagesButton = screen.getByLabelText(formLabels.images);
      await user.upload(selectImagesButton, imageFiles[0]);
      expect(screen.getByAltText(imageFiles[0].name)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: `remove-${imageFiles[0].name}` })
      );

      const removeButtons = screen.getAllByRole('button', {
        name: /^remove-/g
      });
      expect(removeButtons).toHaveLength(1);

      for (let i = 0, j = removeButtons.length; i < j; i++) {
        await user.click(
          screen.getByRole('button', {
            name: `remove-${imageFiles[i].name}`
          })
        );
      }

      expect(
        screen.queryAllByRole('button', {
          name: /^remove-/g
        })
      ).toHaveLength(0);

      for (const file of imageFiles) {
        expect(screen.queryByAltText(file.name)).not.toBeInTheDocument();
      }

      // only a single instance of each file
      await user.upload(selectImagesButton, imageFiles[0]);
      await user.upload(selectImagesButton, imageFiles[0]);
      expect(screen.getAllByAltText(imageFiles[0].name)).toHaveLength(1);

      // max 1 file
      const secondFile = new File(['file-e'], 'file-e.png', {
        type: 'image/png'
      });
      await user.upload(selectImagesButton, [imageFiles[0], secondFile]);
      expect(screen.queryByAltText(secondFile.name)).not.toBeInTheDocument();
    });
  });

  describe('submit button', () => {
    it('correctly renders the SubmitButton as disabled when any fields are invalid', () => {
      render(<CreateGarage />);

      expect(screen.getByLabelText(formLabels.title)).toBeInvalid();
      expect(
        screen.getByRole('button', {
          name: garageStrings.createGarage.defaultMessage
        })
      ).toBeDisabled();
    });

    it('correctly renders the SubmitButton as enabled when fields are valid', async () => {
      render(<CreateGarage />);
      const user = userEvent.setup();

      const titleInput = screen.getByLabelText(formLabels.title);

      await user.type(titleInput, inputValues.title);

      expect(screen.getByLabelText(formLabels.title)).toBeValid();
      expect(
        screen.getByRole('button', {
          name: garageStrings.createGarage.defaultMessage
        })
      ).not.toBeDisabled();
    });
  });
});
