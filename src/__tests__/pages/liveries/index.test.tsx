import '@testing-library/jest-dom';
import { render, screen, waitFor } from '../../../utils/testing/test-utils';
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
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
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

describe('Liveries', () => {
  it('renders a livery', async () => {
    render(<Liveries />);

    await waitFor(() => {
      expect(screen.getAllByText(testLivery.creator.displayName)).toBeTruthy();
      expect(screen.getAllByText(testLivery.title)).toBeTruthy();
      expect(
        screen.getAllByText(`£${(testLivery.price / 100).toFixed(2)}`)
      ).toBeTruthy();
    });
  });
});
