import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { commonStrings, formStrings } from '../../../../utils/intl';
import {
  render,
  screen,
  setMockCurrentUser
} from '../../../../utils/testing/test-utils';
import { Form } from '../../../shared';
import UpdateProfile from './UpdateProfile';

const formLabels: Record<string, string> = {
  about: formStrings.about.defaultMessage,
  firstName: formStrings.firstName.defaultMessage,
  lastName: formStrings.lastName.defaultMessage,
  email: formStrings.email.defaultMessage,
  displayName: formStrings.displayName.defaultMessage,
  images: commonStrings.selectImage.defaultMessage
};

const errorMessages: Record<string, string> = {
  invalidEmail: formStrings.invalidEmailFormat.defaultMessage,
  required: formStrings.fieldNull.defaultMessage
};

const imageFiles = [
  new File(['file-a'], 'file-a.png', { type: 'image/png' }),
  new File(['file-b'], 'file-b.jpeg', { type: 'image/jpeg' }),
  new File(['file-c'], 'file-c.webp', { type: 'image/webp' })
];

const buttonText: Record<string, string> = {
  saveChanges: commonStrings.saveChanges.defaultMessage
};

const inputValues = {
  about: 'testing about',
  firstName: 'testing first name',
  lastName: 'testing last name',
  email: 'testing@test.com',
  invalidEmail: 'invalid email',
  displayName: 'testing display name',
  images: undefined
};

const defaultValues = {
  about: 'existing about',
  displayName: 'existing display name',
  email: 'existing email',
  forename: 'existing forename',
  surname: 'existing surname'
};

const TestComponent = () => (
  <Form>
    <UpdateProfile {...defaultValues} />
  </Form>
);

describe('UpdateProfile', () => {
  beforeEach(() => {
    setMockCurrentUser({ token: null, data: null, status: 'idle' });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => jest.clearAllMocks());

  describe('renders labels and buttons', () => {
    it('renders the labels for all form fields', () => {
      render(<TestComponent />);
      for (const label in formLabels) {
        expect(screen.getByLabelText(formLabels[label])).toBeInTheDocument();
      }
    });

    it('renders the submit button', () => {
      render(<TestComponent />);
      for (const text in buttonText) {
        expect(screen.getByText(buttonText[text])).toBeInTheDocument();
      }
    });
  });

  describe('first name field', () => {
    it('correctly renders the first name field', async () => {
      render(<TestComponent />);
      const user = userEvent.setup();

      const firstNameInput = screen.getByLabelText(formLabels.firstName);
      expect(firstNameInput).toBeInTheDocument();
      expect(firstNameInput).not.toBeRequired();
      await user.clear(firstNameInput);

      await user.type(firstNameInput, inputValues.firstName);
      expect(
        screen.getByDisplayValue(inputValues.firstName)
      ).toBeInTheDocument();
    });
  });

  describe('last name field', () => {
    it('correctly renders the last name field', async () => {
      render(<TestComponent />);
      const user = userEvent.setup();

      const lastNameInput = screen.getByLabelText(formLabels.lastName);
      expect(lastNameInput).toBeInTheDocument();
      expect(lastNameInput).not.toBeRequired();
      await user.clear(lastNameInput);

      await user.type(lastNameInput, inputValues.lastName);
      expect(
        screen.getByDisplayValue(inputValues.lastName)
      ).toBeInTheDocument();
    });
  });

  describe('email field', () => {
    it('correctly renders the email field with and without errors', async () => {
      render(<TestComponent />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(formLabels.email);
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toBeRequired();
      await user.clear(emailInput);

      expect(screen.getAllByText(errorMessages.required)).toHaveLength(1);
      expect(
        screen.getByRole('status', { name: `${formLabels.email}-error` })
      ).toBeInTheDocument();

      await user.type(emailInput, inputValues.invalidEmail);

      expect(screen.getByText(errorMessages.invalidEmail)).toBeInTheDocument();
      expect(
        screen.queryByRole('status', { name: `${formLabels.email}-error` })
      ).toBeInTheDocument();

      await user.clear(emailInput);
      await user.type(emailInput, inputValues.email);

      expect(
        screen.queryByText(errorMessages.invalidEmail)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('status', { name: `${formLabels.email}-error` })
      ).not.toBeInTheDocument();
    });
  });

  describe('display name field', () => {
    it('correctly renders the display name field with and without errors', async () => {
      render(<TestComponent />);
      const user = userEvent.setup();

      const displayNameInput = screen.getByLabelText(formLabels.displayName);
      expect(displayNameInput).toBeInTheDocument();
      expect(displayNameInput).toBeRequired();
      await user.clear(displayNameInput);

      expect(screen.getAllByText(errorMessages.required)).toHaveLength(1);
      expect(
        screen.getByRole('status', { name: `${formLabels.displayName}-error` })
      ).toBeInTheDocument();

      await user.type(displayNameInput, inputValues.displayName);

      expect(screen.queryAllByText(errorMessages.required)).toHaveLength(0);
      expect(
        screen.queryByRole('status', {
          name: `${formLabels.displayName}-error`
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('about field', () => {
    it('correctly renders the about field', async () => {
      render(<TestComponent />);
      const user = userEvent.setup();

      const aboutInput = screen.getByLabelText(formLabels.about);
      expect(aboutInput).toBeInTheDocument();
      expect(aboutInput).not.toBeRequired();
      await user.clear(aboutInput);

      await user.type(aboutInput, inputValues.about);
      expect(screen.getByDisplayValue(inputValues.about)).toBeInTheDocument();
    });
  });

  describe('select images section', () => {
    it('correctly renders the selectImages section with a button and helperText', async () => {
      render(<TestComponent />);

      expect(screen.getByLabelText(formLabels.images)).toBeInTheDocument();
      expect(
        screen.getByRole('note', {
          name: `${formLabels.images}-helper`
        })
      );
    });

    it('correctly renders the selectImages section with items based on single File input', async () => {
      render(<TestComponent />);
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
    it('correctly renders the SubmitButton as disabled when any fields are invalid', async () => {
      render(<TestComponent />);
      const user = userEvent.setup();

      const displayName = screen.getByLabelText(formLabels.displayName);
      const email = screen.getByLabelText(formLabels.email);

      await user.clear(displayName);
      await user.clear(email);

      expect(screen.getByLabelText(formLabels.displayName)).toBeInvalid();
      expect(
        screen.getByRole('button', {
          name: commonStrings.saveChanges.defaultMessage
        })
      ).toBeDisabled();
    });

    it('correctly renders the SubmitButton as enabled when fields are valid', async () => {
      render(<TestComponent />);
      const user = userEvent.setup();

      const displayName = screen.getByLabelText(formLabels.displayName);
      const email = screen.getByLabelText(formLabels.email);

      await user.clear(displayName);
      await user.clear(email);

      await user.type(displayName, inputValues.displayName);
      await user.type(email, inputValues.email);

      expect(screen.getByLabelText(formLabels.displayName)).toBeValid();
      expect(screen.getByLabelText(formLabels.email)).toBeValid();
      expect(
        screen.getByRole('button', {
          name: commonStrings.saveChanges.defaultMessage
        })
      ).not.toBeDisabled();
    });
  });
});
