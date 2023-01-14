import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {
  commonStrings,
  formStrings,
  liveryStrings
} from '../../../../utils/intl';
import {
  getDefaultNormalizer,
  render,
  screen,
  setMockCurrentUser
} from '../../../../utils/testing/test-utils';
import UpdateLivery from './UpdateLivery';
import liveries from '../../../../utils/dev-data/liveries.json';

const livery = liveries[0];

const formLabels: Record<string, string> = {
  title: formStrings.title.defaultMessage + '*',
  description: formStrings.description.defaultMessage,
  searchTags: formStrings.searchTags.defaultMessage,
  images: commonStrings.selectImages.defaultMessage
};

const imageFiles = [
  new File(['file-a'], 'file-a.png', { type: 'image/png' }),
  new File(['file-b'], 'file-b.jpeg', { type: 'image/jpeg' }),
  new File(['file-c'], 'file-c.webp', { type: 'image/webp' }),
  new File(['file-d'], 'file-d.jpg', { type: 'image/jpeg' })
];

const buttonText: Record<string, string> = {
  uploadLivery: liveryStrings.updateLivery.defaultMessage,
  cancel: commonStrings.cancel.defaultMessage
};

const inputValues = {
  title: 'testing title',
  description: 'testing description',
  searchTags: undefined,
  images: undefined
};

describe('UpdateLivery', () => {
  beforeEach(() => {
    setMockCurrentUser({ token: null, data: null, status: 'idle' });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => jest.clearAllMocks());

  describe('renders labels and buttons', () => {
    it('renders the labels for all form fields', () => {
      render(<UpdateLivery livery={livery} />);
      for (const label in formLabels) {
        expect(screen.getByLabelText(formLabels[label])).toBeInTheDocument();
      }
    });

    it('renders the submit and cancel buttons', () => {
      render(<UpdateLivery livery={livery} />);
      for (const text in buttonText) {
        expect(screen.getByText(buttonText[text])).toBeInTheDocument();
      }
    });
  });

  describe('title field', () => {
    it('correctly renders the title field', async () => {
      render(<UpdateLivery livery={livery} />);
      const user = userEvent.setup();

      const titleInput = screen.getByLabelText(formLabels.title);
      expect(titleInput).toBeInTheDocument();
      expect(titleInput).toBeRequired();

      await user.type(titleInput, inputValues.title);

      expect(
        screen.getByDisplayValue(`${livery.title}${inputValues.title}`)
      ).toBeInTheDocument();
    });
  });

  describe('description field', () => {
    it('correctly renders the description field', async () => {
      render(<UpdateLivery livery={livery} />);
      const user = userEvent.setup();

      const descriptionInput = screen.getByLabelText(formLabels.description);
      expect(descriptionInput).toBeInTheDocument();
      expect(descriptionInput).not.toBeRequired();

      await user.type(descriptionInput, inputValues.description);
      expect(
        screen.getByDisplayValue(
          `${livery.description}${inputValues.description}`,
          {
            normalizer: getDefaultNormalizer({
              trim: false,
              collapseWhitespace: false
            })
          }
        )
      ).toBeInTheDocument();
    });
  });

  describe('search tags field', () => {
    it('correctly renders the SearchTags input', async () => {
      render(<UpdateLivery livery={livery} />);
      const tagsInput = screen.getByLabelText(formLabels.searchTags);
      expect(tagsInput).toBeInTheDocument();
      expect(
        screen.getByRole('note', {
          name: `${formLabels.searchTags}-helper`
        })
      );
    });

    it('correctly renders the tags based on the SearchTags input', async () => {
      render(<UpdateLivery livery={livery} />);
      const user = userEvent.setup();

      const TAG_A = 'tag-a';
      const TAG_B = 'tag-b';
      const TAG_C = 'tag-c';

      const tagsInput = screen.getByLabelText(formLabels.searchTags);
      expect(tagsInput).toBeInTheDocument();
      expect(
        screen.getByRole('note', {
          name: `${formLabels.searchTags}-helper`
        })
      );

      for (const tag of livery.tags.split(',')) {
        expect(screen.getByRole('listitem', { name: tag })).toBeInTheDocument();
      }

      // without a comma === one rendered tag
      await user.type(tagsInput, `,${TAG_A}`);
      expect(screen.getByRole('listitem', { name: TAG_A })).toBeInTheDocument();

      await user.type(tagsInput, TAG_B);
      expect(
        screen.queryByRole('listitem', { name: TAG_B })
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('listitem', { name: `${TAG_A}${TAG_B}` })
      ).toBeInTheDocument();
      await user.clear(tagsInput);

      // with commas separates tags
      await user.type(tagsInput, `${TAG_A},`);
      expect(screen.getByRole('listitem', { name: TAG_A })).toBeInTheDocument();
      await user.type(tagsInput, `${TAG_B},`);
      expect(screen.getByRole('listitem', { name: TAG_B })).toBeInTheDocument();
      await user.type(tagsInput, `${TAG_C},`);
      expect(screen.getByRole('listitem', { name: TAG_C })).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(`${TAG_A},${TAG_B},${TAG_C},`)
      ).toBeInTheDocument();
    });
  });

  describe('select images section', () => {
    it('correctly renders the selectImages section with a button and helperText', async () => {
      render(<UpdateLivery livery={livery} />);

      expect(screen.getByLabelText(formLabels.images)).toBeInTheDocument();
      expect(
        screen.getByRole('note', {
          name: `${formLabels.images}-helper`
        })
      );
    });

    it('correctly renders the selectImages section with items based on single File input', async () => {
      render(<UpdateLivery livery={livery} />);
      const user = userEvent.setup();

      let removeButtons = screen.getAllByRole('button', {
        name: /^remove-/g
      });
      expect(removeButtons).toHaveLength(4);

      for (let i = removeButtons.length - 1; i >= 0; i--) {
        await user.click(removeButtons[i]);
      }

      expect(
        screen.queryAllByRole('button', {
          name: /^remove-/g
        })
      ).toHaveLength(0);

      // single file
      const selectImagesButton = screen.getByLabelText(formLabels.images);
      await user.upload(selectImagesButton, imageFiles[0]);
      expect(screen.getByAltText(imageFiles[0].name)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: `remove-${imageFiles[0].name}` })
      );

      // second file
      await user.upload(selectImagesButton, imageFiles[1]);
      expect(screen.getByAltText(imageFiles[1].name)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: `remove-${imageFiles[1].name}` })
      );

      // file 3 and 4 together
      await user.upload(selectImagesButton, imageFiles.slice(2));
      expect(screen.getByAltText(imageFiles[2].name)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: `remove-${imageFiles[2].name}` })
      );
      expect(screen.getByAltText(imageFiles[3].name)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: `remove-${imageFiles[3].name}` })
      );

      removeButtons = screen.getAllByRole('button', {
        name: /^remove-/g
      });
      expect(removeButtons).toHaveLength(4);

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

      // max 4 files
      const fithFile = new File(['file-e'], 'file-e.png', {
        type: 'image/png'
      });
      await user.upload(selectImagesButton, [...imageFiles, fithFile]);
      expect(screen.queryByAltText(fithFile.name)).not.toBeInTheDocument();
    });
  });
});
