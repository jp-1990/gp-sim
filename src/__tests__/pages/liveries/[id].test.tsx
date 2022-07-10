import '@testing-library/jest-dom';
import { render, screen, waitFor } from '../../../utils/testing/test-utils';
import { expectAllToBeInDocument } from '../../../utils/testing/helpers';
import Livery from '../../../pages/liveries/[id]';

describe('Livery', () => {
  const liveryInCurrentUserCollection = {
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

  const liveryNotInCurrentUserCollection = {
    id: '101031e2-5973-48ac-8a85-8990e91c534b',
    createdAt: 1651734649486,
    updatedAt: 1651734649486,
    creator: {
      id: '1',
      displayName: 'Angel Willis',
      image: '/car6.png'
    },
    title: 'Swamp Jewel',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    car: 'Audi R8 LMS GT4',
    price: 4142,
    tags: 'Replica,90s,LeMans remake',
    searchHelpers: [
      'Replica',
      '90s',
      'LeMans remake',
      'Swamp Jewel',
      'Angel Willis'
    ],
    isPublic: true,
    images: ['/car1.png', '/car6.png', '/car5.png', '/car4.png'],
    liveryFiles: '/test-livery-title.zip',
    rating: 5,
    downloads: 1306
  };

  it('renders the expected items based on props when a user can add to their collection', async () => {
    render(<Livery id="101031e2-5973-48ac-8a85-8990e91c534b" />);
    const { downloads, car, title, creator, tags } =
      liveryNotInCurrentUserCollection;
    const downloadNum = `${downloads} Downloads`;
    const carAndTitle = `${car} - ${title}`;
    const price = `£${(liveryNotInCurrentUserCollection.price / 100).toFixed(
      2
    )}`;
    await waitFor(() => {
      expect(screen.queryAllByText(carAndTitle)).toHaveLength(2);
      expectAllToBeInDocument([
        downloadNum,
        creator.displayName,
        price,
        ...tags.split(',')
      ]);
    });
  });

  it('renders the expected items based on props when a user cannot add to their collection', async () => {
    render(<Livery id="d03bfb4f-3b88-41ec-92bb-14b3438696ec" />);
    const { downloads, car, title, creator, tags } =
      liveryInCurrentUserCollection;
    const downloadNum = `${downloads} Downloads`;
    const carAndTitle = `${car} - ${title}`;
    await waitFor(() => {
      expect(screen.queryAllByText(carAndTitle)).toHaveLength(2);
      expectAllToBeInDocument([
        downloadNum,
        creator.displayName,
        ...tags.split(',')
      ]);
    });
  });
});
