import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {
  commonStrings,
  formStrings,
  liveryStrings
} from '../../../../utils/intl';
import {
  render,
  screen,
  setTestUser
} from '../../../../utils/testing/test-utils';
import {
  DYNAMIC_LIVERY_FILE_NAME,
  LIVERY_FILE_NAMES
} from '../../../shared/Form/utils';
import CreateLivery from './CreateLivery';

const formLabels: Record<string, string> = {
  title: formStrings.title.defaultMessage + '*',
  description: formStrings.description.defaultMessage,
  car: formStrings.car.defaultMessage + '*',
  liveryFiles: formStrings.selectLiveryFiles.defaultMessage,
  price: formStrings.price.defaultMessage,
  searchTags: formStrings.searchTags.defaultMessage,
  images: commonStrings.selectImages.defaultMessage
};
const hiddenFormLabels: Record<string, string> = {
  garage: formStrings.garage.defaultMessage,
  garageKey: formStrings.garageKey.defaultMessage
};

const requiredLiveryFileNames = [
  DYNAMIC_LIVERY_FILE_NAME,
  ...LIVERY_FILE_NAMES
];

const liveryFiles = [
  new File(['your-livery-name.json'], 'your-livery-name.json', {
    type: 'application/json'
  }),
  new File(['sponsors.json'], 'sponsors.json', { type: 'application/json' }),
  new File(['sponsors.png'], 'sponsors.png', { type: 'image/png' }),
  new File(['decals.json'], 'decals.json', { type: 'application/json' }),
  new File(['decals.png'], 'decals.png', { type: 'image/png' })
];
const invalidLiveryFiles = [
  new File(['!@^&$#*^().json'], '!@^&$#*^().json', {
    type: 'application/json'
  }),
  new File(['sponsor.json'], 'sponsor.json', { type: 'application/json' }),
  new File(['sponso.png'], 'sponso.png', { type: 'image/png' }),
  new File(['decal.json'], 'decal.json', { type: 'application/json' }),
  new File(['deca.png'], 'deca.png', { type: 'image/png' })
];

const imageFiles = [
  new File(['file-a'], 'file-a.png', { type: 'image/png' }),
  new File(['file-b'], 'file-b.jpeg', { type: 'image/jpeg' }),
  new File(['file-c'], 'file-c.webp', { type: 'image/webp' }),
  new File(['file-d'], 'file-d.jpg', { type: 'image/jpeg' })
];

const buttonText: Record<string, string> = {
  uploadLivery: liveryStrings.uploadLivery.defaultMessage,
  cancel: commonStrings.cancel.defaultMessage
};

const inputValues = {
  title: 'testing title',
  description: 'testing description',
  car: undefined,
  liveryFiles: undefined,
  price: undefined,
  searchTags: undefined,
  images: undefined
};

describe('CreateLivery', () => {
  beforeEach(() => {
    setTestUser(undefined);
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterAll(() => jest.clearAllMocks());

  it('renders the labels for all form fields', () => {
    render(<CreateLivery />);
    for (const label in formLabels) {
      expect(screen.getByLabelText(formLabels[label])).toBeInTheDocument();
    }
  });

  it('renders the submit and cancel buttons', () => {
    render(<CreateLivery />);
    for (const text in buttonText) {
      expect(screen.getByText(buttonText[text])).toBeInTheDocument();
    }
  });

  it('correctly renders the title field with and without error', async () => {
    render(<CreateLivery />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(formLabels.title);
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toBeRequired();

    expect(screen.getAllByRole('status')).toHaveLength(3);

    await user.type(titleInput, inputValues.title);
    expect(screen.getAllByRole('status')).toHaveLength(2);

    expect(screen.getByDisplayValue(inputValues.title)).toBeInTheDocument();
  });

  it('correctly renders the car field with and without error', async () => {
    render(<CreateLivery />);
    const user = userEvent.setup();

    const carInput = screen.getByLabelText(formLabels.car);
    expect(carInput).toBeInTheDocument();
    expect(carInput).toBeRequired();

    expect(screen.getAllByRole('status')).toHaveLength(3);

    const option: HTMLOptionElement = screen.getByRole('option', {
      name: 'Alpine A110 GT4'
    });
    await user.selectOptions(carInput, option);
    expect(screen.getAllByRole('status')).toHaveLength(2);

    expect(option.selected).toBe(true);
  });

  it('correctly renders the description field', async () => {
    render(<CreateLivery />);
    const user = userEvent.setup();

    const descriptionInput = screen.getByLabelText(formLabels.description);
    expect(descriptionInput).toBeInTheDocument();
    expect(descriptionInput).not.toBeRequired();

    await user.type(descriptionInput, inputValues.description);
    expect(
      screen.getByDisplayValue(inputValues.description)
    ).toBeInTheDocument();
  });

  // SelectLiveryFiles section
  it('correctly renders the selectLivery section with a button, empty table, helperText and error message', () => {
    render(<CreateLivery />);
    const FULL_ERROR_MESSAGE = `${
      formStrings.invalidLiveryFiles.defaultMessage.split('{files}')[0]
    }${requiredLiveryFileNames.join(', ')}`;

    expect(
      screen.getByText(formStrings.selectLiveryFilesHelperText.defaultMessage)
    ).toBeInTheDocument();
    expect(screen.getAllByRole('status')).toHaveLength(3);
    expect(screen.getByText(FULL_ERROR_MESSAGE)).toBeInTheDocument();
    expect(screen.getByLabelText(formLabels.liveryFiles)).toBeInTheDocument();
  });

  it('correctly renders the selectLivery section table based on File input, with the error message updated and a remove button. When remove is clicked, the item should no longer be rendered', async () => {
    render(<CreateLivery />);
    const FULL_ERROR_MESSAGE = `${
      formStrings.invalidLiveryFiles.defaultMessage.split('{files}')[0]
    }${requiredLiveryFileNames.join(', ')}`;
    const user = userEvent.setup();

    const selectLiveryButton = screen.getByLabelText(formLabels.liveryFiles);

    // upload 1 file, check error message, then remove it
    await user.upload(selectLiveryButton, liveryFiles[1]);
    expect(screen.getAllByText(liveryFiles[1].name)).toHaveLength(2);
    expect(
      screen.getByRole('status', { name: `${formLabels.liveryFiles}-error` })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${
          formStrings.invalidLiveryFiles.defaultMessage.split('{files}')[0]
        }${requiredLiveryFileNames
          .filter((el) => el !== liveryFiles[1].name)
          .join(', ')}`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: `remove-${liveryFiles[1].name}` })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: `remove-${liveryFiles[1].name}` })
    );
    expect(screen.getAllByText(liveryFiles[1].name)).toHaveLength(1);
    expect(screen.getByText(FULL_ERROR_MESSAGE)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: `remove-${liveryFiles[1].name}` })
    ).not.toBeInTheDocument();

    // upload all correct files, check error message, remove, check error messge
    await user.upload(selectLiveryButton, liveryFiles);
    const [dynamic, ...fixed] = liveryFiles;
    expect(screen.getByText(dynamic.name)).toBeInTheDocument();
    for (const file of fixed) {
      expect(screen.getAllByText(file.name)).toHaveLength(2);
    }
    expect(
      screen.queryByRole('status', { name: `${formLabels.liveryFiles}-error` })
    ).not.toBeInTheDocument();

    for (const file of requiredLiveryFileNames) {
      await user.click(screen.getByRole('button', { name: `remove-${file}` }));
    }
    expect(screen.getByText(FULL_ERROR_MESSAGE)).toBeInTheDocument();

    // upload all incorrect files, check error message, remove, check error message
    await user.upload(selectLiveryButton, invalidLiveryFiles);
    expect(
      screen.getByText(
        `${
          formStrings.invalidLiveryFiles.defaultMessage.split('{files}')[0]
        }${requiredLiveryFileNames.filter((_, i) => i > 0).join(', ')}`
      )
    ).toBeInTheDocument();
    for (const file of [...requiredLiveryFileNames].reverse()) {
      await user.click(screen.getByRole('button', { name: `remove-${file}` }));
    }
    expect(screen.getByText(FULL_ERROR_MESSAGE)).toBeInTheDocument();

    // upload 4 correct fixed files and 1 dynamic with an incorrect name, check error message, remove, check error message
    await user.upload(selectLiveryButton, [
      ...liveryFiles.slice(1),
      invalidLiveryFiles[0]
    ]);
    expect(
      screen.getByText(formStrings.invalidDynamicLiveryFileName.defaultMessage)
    ).toBeInTheDocument();
    for (const file of requiredLiveryFileNames) {
      await user.click(screen.getByRole('button', { name: `remove-${file}` }));
    }
    expect(screen.getByText(FULL_ERROR_MESSAGE)).toBeInTheDocument();
  });

  it('correctly renders the public livery checkbox', async () => {
    render(<CreateLivery />);
    const user = userEvent.setup();

    const checkbox: HTMLInputElement = screen.getByRole('checkbox', {
      name: formStrings.makeThisLiveryPublic.defaultMessage
    });

    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(true);

    await user.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('correctly renders the private garage checkbox', async () => {
    render(<CreateLivery />);
    const user = userEvent.setup();

    const checkbox: HTMLInputElement = screen.getByRole('checkbox', {
      name: formStrings.addThisLiveryToAPrivateGarage.defaultMessage
    });

    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBeFalsy();

    await user.click(checkbox);
    expect(checkbox.checked).toBe(true);
    await user.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('correctly renders the SelectGarage and GarageKey fields when the private garage checkbox is checked', async () => {
    render(<CreateLivery />);
    const user = userEvent.setup();

    for (const key in hiddenFormLabels) {
      expect(
        screen.queryByLabelText(hiddenFormLabels[key])
      ).not.toBeInTheDocument();
    }
    const checkbox: HTMLInputElement = screen.getByRole('checkbox', {
      name: formStrings.addThisLiveryToAPrivateGarage.defaultMessage
    });
    expect(checkbox).toBeInTheDocument();
    await user.click(checkbox);
    expect(checkbox.checked).toBe(true);

    for (const key in hiddenFormLabels) {
      expect(
        screen.queryByLabelText(hiddenFormLabels[key])
      ).toBeInTheDocument();
    }

    await user.click(checkbox);
    expect(checkbox.checked).toBe(false);

    for (const key in hiddenFormLabels) {
      expect(
        screen.queryByLabelText(hiddenFormLabels[key])
      ).not.toBeInTheDocument();
    }
  });

  it('shows garage key or garage field as disabled when the other field has a value', async () => {
    render(<CreateLivery />);
    const user = userEvent.setup();

    const checkbox: HTMLInputElement = screen.getByRole('checkbox', {
      name: formStrings.addThisLiveryToAPrivateGarage.defaultMessage
    });
    expect(checkbox).toBeInTheDocument();
    await user.click(checkbox);
    expect(checkbox.checked).toBe(true);

    for (const key in hiddenFormLabels) {
      const element = screen.queryByLabelText(hiddenFormLabels[key]);
      expect(element).toBeInTheDocument();
      expect(element).not.toBeDisabled();
    }

    await user.selectOptions(
      screen.getByLabelText(hiddenFormLabels.garage),
      'Option 1'
    );
    expect(screen.getByLabelText(hiddenFormLabels.garageKey)).toBeDisabled();
    await user.selectOptions(
      screen.getByLabelText(hiddenFormLabels.garage),
      formStrings.garagePlaceholder.defaultMessage
    );
    expect(
      screen.getByLabelText(hiddenFormLabels.garageKey)
    ).not.toBeDisabled();

    await user.type(
      screen.getByLabelText(hiddenFormLabels.garageKey),
      'garage'
    );
    expect(screen.getByLabelText(hiddenFormLabels.garage)).toBeDisabled();
    await user.clear(screen.getByLabelText(hiddenFormLabels.garageKey));
    expect(screen.getByLabelText(hiddenFormLabels.garage)).not.toBeDisabled();
  });

  it('correctly renders the price input', async () => {
    render(<CreateLivery />);
    const user = userEvent.setup();

    const STRING_TEST = 'test';
    const INT_TEST = '10';
    const FLOAT_TEST = '5.99';

    const priceInput = screen.getByLabelText(formLabels.price);
    expect(priceInput).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(formStrings.pricePlaceholder.defaultMessage)
    ).toBeInTheDocument();

    await user.type(priceInput, STRING_TEST);
    expect(screen.queryByDisplayValue(STRING_TEST)).not.toBeInTheDocument();

    await user.clear(priceInput);
    await user.type(priceInput, INT_TEST);
    expect(screen.queryByDisplayValue(INT_TEST)).toBeInTheDocument();

    await user.clear(priceInput);
    await user.type(priceInput, FLOAT_TEST);
    expect(screen.queryByDisplayValue(FLOAT_TEST)).toBeInTheDocument();
  });

  it('correctly renders the SearchTags input', async () => {
    render(<CreateLivery />);
    const tagsInput = screen.getByLabelText(formLabels.searchTags);
    expect(tagsInput).toBeInTheDocument();
    expect(
      screen.getByRole('note', {
        name: `${formLabels.searchTags}-helper`
      })
    );
  });

  it('correctly renders the tags based on the SearchTags input', async () => {
    render(<CreateLivery />);
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

    // without a comma === one rendered tag
    await user.type(tagsInput, TAG_A);
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

  // SelectImages section
  it('correctly renders the selectImages section with a button and helperText', async () => {
    render(<CreateLivery />);

    expect(screen.getByLabelText(formLabels.images)).toBeInTheDocument();
    expect(
      screen.getByRole('note', {
        name: `${formLabels.images}-helper`
      })
    );
  });

  it('correctly renders the selectImages section with items based on single File input', async () => {
    render(<CreateLivery />);
    const user = userEvent.setup();
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

    const removeButtons = screen.getAllByRole('button', {
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

    for (const file of liveryFiles) {
      expect(screen.queryByAltText(file.name)).not.toBeInTheDocument();
    }

    // only a single instance of each file
    await user.upload(selectImagesButton, imageFiles[0]);
    await user.upload(selectImagesButton, imageFiles[0]);
    expect(screen.getAllByAltText(imageFiles[0].name)).toHaveLength(1);

    // max 4 files
    const fithFile = new File(['file-e'], 'file-e.png', { type: 'image/png' });
    await user.upload(selectImagesButton, [...imageFiles, fithFile]);
    expect(screen.queryByAltText(fithFile.name)).not.toBeInTheDocument();
  });

  // SubmitButton
  it('correctly renders the SubmitButton as disabled when any fields are invalid', () => {
    render(<CreateLivery />);

    expect(screen.getByLabelText(formLabels.title)).toBeInvalid();
    expect(screen.getByLabelText(formLabels.car)).toBeInvalid();
    expect(screen.getByLabelText(formLabels.liveryFiles)).toBeInvalid();
    expect(
      screen.getByRole('button', {
        name: liveryStrings.uploadLivery.defaultMessage
      })
    ).toBeDisabled();
  });

  it('correctly renders the SubmitButton as enabled when fields are valid', async () => {
    render(<CreateLivery />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(formLabels.title);
    const carInput = screen.getByLabelText(formLabels.car);
    const liveryFilesInput = screen.getByLabelText(formLabels.liveryFiles);

    await user.type(titleInput, inputValues.title);
    const option: HTMLOptionElement = screen.getByRole('option', {
      name: 'Alpine A110 GT4'
    });
    await user.selectOptions(carInput, option);
    await user.upload(liveryFilesInput, liveryFiles);

    expect(screen.getByLabelText(formLabels.title)).toBeValid();
    expect(screen.getByLabelText(formLabels.car)).toBeValid();
    expect(screen.getByLabelText(formLabels.liveryFiles)).toBeValid();
    expect(
      screen.getByRole('button', {
        name: liveryStrings.uploadLivery.defaultMessage
      })
    ).not.toBeDisabled();
  });

  // it('submits with the expected values when submit is clicked', () => {
  //   render(<CreateLivery />);
  //   expect(true).toBe(false);
  // });

  // it('fires the expected function when cancel is clicked', () => {
  //   render(<CreateLivery />);
  //   expect(true).toBe(false);
  // });
});
