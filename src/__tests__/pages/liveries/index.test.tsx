import '@testing-library/jest-dom';
import { render } from '../../../utils/testing/test-utils';
import { expectAllToBeInDocument } from '../../../utils/testing/helpers';
import Liveries from '../../../pages/liveries/index';

const testLivery = {
  id: '0',
  rating: 4,
  downloads: 200,
  imgUrls: [],
  price: '40.37',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n                  Mauris mauris eros, euismod ut mi vitae, convallis iaculis\n                  quam. Pellentesque consectetur iaculis tortor vitae euismod.\n                  Integer malesuada congue elementum. Pellentesque vulputate\n                  diam dignissim elit hendrerit iaculis.',
  author: 'Makena Mann',
  title: 'Pub Crawl',
  car: 'Aston Martin V8 Vantage GT4',
  tags: ['90s', '90s', '2010s']
};

describe('Liveries', () => {
  it('renders a livery', () => {
    render(<Liveries ids={['0']} liveries={{ '0': testLivery }} />);
    const testValues = [testLivery.author, testLivery.title, testLivery.price];
    expectAllToBeInDocument(Object.values(testValues));
    expect(true).toBe(true);
  });
});
