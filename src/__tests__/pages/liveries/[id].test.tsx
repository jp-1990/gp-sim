import '@testing-library/jest-dom';
import { render, screen } from '../../../utils/testing/test-utils';
import { expectAllToBeInDocument } from '../../../utils/testing/helpers';
import Livery from '../../../pages/liveries/[id]';

describe('Livery', () => {
  const testLivery = {
    id: '0',
    rating: 3,
    downloads: 100,
    imgUrls: [],
    price: '5.00',
    author: 'test-author',
    title: 'test-title',
    car: 'car-name',
    tags: ['tag-0', 'tag-1'],
    description: 'test-description'
  };
  it('renders the expected items based on props', () => {
    render(<Livery {...testLivery} />);
    const { queryAllByText } = screen;
    const { id, rating, downloads, imgUrls, tags, title, car, ...testValues } =
      testLivery;
    const downloadNum = `${downloads} Downloads`;
    const carAndTitle = `${car} - ${title}`;

    expect(queryAllByText(carAndTitle)).toHaveLength(2);
    expectAllToBeInDocument([
      ...Object.values(testValues),
      ...tags,
      downloadNum
    ]);
  });
});
