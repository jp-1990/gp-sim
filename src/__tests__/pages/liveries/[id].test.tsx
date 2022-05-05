import '@testing-library/jest-dom';
import { render, screen } from '../../../utils/testing/test-utils';
import { expectAllToBeInDocument } from '../../../utils/testing/helpers';
import Livery from '../../../pages/liveries/[id]';

describe('Livery', () => {
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

  it('renders the expected items based on props', () => {
    render(<Livery {...testLivery} />);
    const { downloads, car, title, creator, price, description, tags } =
      testLivery;
    const downloadNum = `${downloads} Downloads`;
    const carAndTitle = `${car} - ${title}`;

    expect(screen.queryAllByText(carAndTitle)).toHaveLength(2);
    expectAllToBeInDocument([
      downloadNum,
      creator.displayName,
      description,
      `£${(testLivery.price / 100).toFixed(2)}`,
      ...tags.split(',')
    ]);
  });
});
