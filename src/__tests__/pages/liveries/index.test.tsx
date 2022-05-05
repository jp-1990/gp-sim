import '@testing-library/jest-dom';
import { render } from '../../../utils/testing/test-utils';
import { expectAllToBeInDocument } from '../../../utils/testing/helpers';
import Liveries from '../../../pages/liveries/index';

const testLivery = {
  id: 'd03bfb4f-3b88-41ec-92bb-14b3438696ec',
  createdAt: 1651734649485,
  updatedAt: 1651734649485,
  creator: {
    id: '0',
    displayName: 'Julius Little',
    image: '/car2.png'
  },
  title: 'Harlequin',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n                  Mauris mauris eros, euismod ut mi vitae, convallis iaculis\n                  quam. Pellentesque consectetur iaculis tortor vitae euismod.\n                  Integer malesuada congue elementum. Pellentesque vulputate\n                  diam dignissim elit hendrerit iaculis.',
  car: 'Audi R8 LMS GT4',
  price: 598,
  tags: 'Red,2010s,Blue',
  searchHelpers: ['Red', '2010s', 'Blue', 'Harlequin', 'Julius Little'],
  isPublic: true,
  images: ['/car2.png', '/car5.png', '/car3.png', '/car6.png'],
  liveryFiles: '/test-livery-title.zip',
  rating: 3,
  downloads: 1965
};

const testCar = {
  id: '0',
  class: 'GT4',
  name: 'Aston Martin V8 Vantage GT4'
};

describe('Liveries', () => {
  it('renders a livery', () => {
    render(
      <Liveries
        livery={{
          ids: ['0'],
          liveries: { '0': testLivery },
          loading: false,
          error: false,
          currentRequestId: null
        }}
        car={{
          ids: ['0'],
          cars: { '0': testCar },
          loading: false,
          error: false,
          currentRequestId: null
        }}
      />
    );
    const testValues = [
      testLivery.creator.displayName,
      testLivery.title,
      `£${(testLivery.price / 100).toFixed(2)}`
    ];
    expectAllToBeInDocument(testValues);
  });
});
