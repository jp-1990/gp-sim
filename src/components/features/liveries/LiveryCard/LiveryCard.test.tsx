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
    id: 'd03bfb4f-3b88-41ec-92bb-14b3438696ec',
    creator: {
      id: '0',
      displayName: 'Julius Little',
      image: '/car2.png'
    },
    title: 'Harlequin',
    car: 'Audi R8 LMS GT4',
    price: 598,
    images: ['/car2.png', '/car5.png', '/car3.png', '/car6.png'],
    rating: 3,
    downloads: 1965
  };

  it('renders the provided values', () => {
    render(<LiveryCard {...testLivery} image={testLivery.images[0]} />);
    const { id, rating, downloads, images, creator, price, ...testValues } =
      testLivery;
    expectAllToBeInDocument([
      ...Object.values(testValues),
      creator.displayName,
      `£${(price / 100).toFixed(2)}`
    ]);
  });

  it('renders the image placeholder when an image is missing', () => {
    render(<LiveryCard {...testLivery} image={''} />);
    const { getByText } = screen;
    expect(getByText('No Image')).toBeInTheDocument();
  });
});
