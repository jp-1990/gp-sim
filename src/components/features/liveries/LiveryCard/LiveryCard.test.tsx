import '@testing-library/jest-dom';
import {
  render,
  screen,
  setTestUser
} from '../../../../utils/testing/test-utils';
import { expectAllToBeInDocument } from '../../../../utils/testing/helpers';
import LiveryCard from './LiveryCard';

describe('LiverCard', () => {
  beforeEach(() => {
    setTestUser(undefined);
  });

  const testLivery = {
    id: '0',
    rating: 1,
    downloads: 176,
    imgUrl: '',
    price: '33.42',
    author: 'Bentley Bennett',
    title: 'Harlequin',
    car: 'BMW M4 GT4'
  };

  it('renders the provided values', () => {
    render(<LiveryCard {...testLivery} />);
    const { id, rating, downloads, imgUrl, ...testValues } = testLivery;
    expectAllToBeInDocument(Object.values(testValues));
  });

  it('renders the image placeholder when an image is missing', () => {
    render(<LiveryCard {...testLivery} />);
    const { getByText } = screen;
    expect(getByText('No Image')).toBeInTheDocument();
  });
});
