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
import UpdateGarage from './UpdateGarage';

const formLabels: Record<string, string> = {
  title: formStrings.title.defaultMessage + '*',
  description: formStrings.description.defaultMessage,
  images: commonStrings.change.defaultMessage
};

const imageFiles = [
  new File(['file-a'], 'file-a.png', { type: 'image/png' }),
  new File(['file-b'], 'file-b.jpeg', { type: 'image/jpeg' }),
  new File(['file-c'], 'file-c.webp', { type: 'image/webp' })
];

const buttonText: Record<string, string> = {
  saveChanges: garageStrings.updateGarage.defaultMessage
};

const inputValues = {
  title: 'testing title',
  description: 'testing description'
};

const garageData = {
  id: '431d885d-4041-4518-bc92-60e69a5d5a94',
  createdAt: 1651734649484,
  updatedAt: 1651734649484,
  creator: {
    id: '0',
    displayName: 'Julius Little',
    image: '/car2.png'
  },
  title: "Julius Little's Garage",
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  image: '/car3.png',
  drivers: ['0', '1', '2'],
  liveries: [
    '46b7b672-2ce1-47b2-a0ce-a66acad40ae2',
    'e129b18d-e008-495d-9fd4-346eb18e60e5',
    'ec5ca764-93b1-4c26-928d-b9ce723b3988'
  ]
};

describe('UpdateGarage', () => {
  beforeEach(() => {
    setMockCurrentUser({ token: null, data: null, status: 'idle' });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => jest.clearAllMocks());

  describe('renders labels and buttons', () => {
    it('renders the labels for all form fields', () => {
      render(
        <UpdateGarage
          id={garageData.id}
          title={garageData.title}
          description={garageData.description}
          drivers={garageData.drivers}
          image={garageData.image}
        />
      );
      for (const label in formLabels) {
        expect(screen.getByLabelText(formLabels[label])).toBeInTheDocument();
      }
    });

    it('renders the submit button', () => {
      render(
        <UpdateGarage
          id={garageData.id}
          title={garageData.title}
          description={garageData.description}
          drivers={garageData.drivers}
          image={garageData.image}
        />
      );
      for (const text in buttonText) {
        expect(screen.getByText(buttonText[text])).toBeInTheDocument();
      }
    });
  });

  describe('title field', () => {
    it('correctly renders the title field with and without error', async () => {
      render(
        <UpdateGarage
          id={garageData.id}
          title={garageData.title}
          description={garageData.description}
          drivers={garageData.drivers}
          image={garageData.image}
        />
      );
      const user = userEvent.setup();

      const titleInput = screen.getByLabelText(formLabels.title);
      expect(titleInput).toBeInTheDocument();
      expect(titleInput).toBeRequired();

      expect(titleInput).toHaveValue(garageData.title);
      expect(screen.queryAllByRole('status')).toHaveLength(0);
      await user.clear(titleInput);

      expect(screen.getAllByRole('status')).toHaveLength(1);

      await user.type(titleInput, inputValues.title);
      expect(screen.queryAllByRole('status')).toHaveLength(0);

      expect(titleInput).toHaveValue(inputValues.title);
    });
  });

  describe('description field', () => {
    it('correctly renders the description field', async () => {
      render(
        <UpdateGarage
          id={garageData.id}
          title={garageData.title}
          description={garageData.description}
          drivers={garageData.drivers}
          image={garageData.image}
        />
      );
      const user = userEvent.setup();

      const descriptionInput = screen.getByLabelText(formLabels.description);
      expect(descriptionInput).toHaveValue(garageData.description);
      await user.clear(descriptionInput);

      expect(descriptionInput).toBeInTheDocument();
      expect(descriptionInput).not.toBeRequired();

      await user.type(descriptionInput, inputValues.description);
      expect(
        screen.getByDisplayValue(inputValues.description)
      ).toBeInTheDocument();
    });
  });

  describe('select images section', () => {
    it('correctly renders the selectImages section with items based on single File input', async () => {
      render(
        <UpdateGarage
          id={garageData.id}
          title={garageData.title}
          description={garageData.description}
          drivers={garageData.drivers}
          image={garageData.image}
        />
      );
      const user = userEvent.setup();
      const selectImagesButton = screen.getByLabelText(formLabels.images);
      await user.upload(selectImagesButton, imageFiles[0]);
      expect(screen.getByAltText(imageFiles[0].name)).toBeInTheDocument();

      const secondFile = new File(['file-e'], 'file-e.png', {
        type: 'image/png'
      });
      await user.upload(selectImagesButton, secondFile);
      expect(screen.queryByAltText(secondFile.name)).toBeInTheDocument();
      expect(screen.queryByAltText(imageFiles[0].name)).not.toBeInTheDocument();
    });
  });

  describe('submit button', () => {
    it('correctly renders the SubmitButton as disabled when any fields are invalid', async () => {
      render(
        <UpdateGarage
          id={garageData.id}
          title={garageData.title}
          description={garageData.description}
          drivers={garageData.drivers}
          image={garageData.image}
        />
      );

      const user = userEvent.setup();

      const titleInput = screen.getByLabelText(formLabels.title);
      expect(titleInput).toBeInTheDocument();
      expect(titleInput).toBeRequired();

      expect(titleInput).toHaveValue(garageData.title);
      expect(screen.queryAllByRole('status')).toHaveLength(0);
      await user.clear(titleInput);

      expect(screen.getAllByRole('status')).toHaveLength(1);
      expect(
        screen.getByRole('button', {
          name: buttonText.saveChanges
        })
      ).toBeDisabled();
    });

    it('correctly renders the SubmitButton as enabled when fields are valid', async () => {
      render(
        <UpdateGarage
          id={garageData.id}
          title={garageData.title}
          description={garageData.description}
          drivers={garageData.drivers}
          image={garageData.image}
        />
      );
      const titleInput = screen.getByLabelText(formLabels.title);

      expect(titleInput).toBeValid();
      expect(
        screen.getByRole('button', {
          name: buttonText.saveChanges
        })
      ).not.toBeDisabled();
    });
  });
});
