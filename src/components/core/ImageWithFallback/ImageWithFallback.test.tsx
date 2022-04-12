import '@testing-library/jest-dom';
import { render, screen, setTestUser } from '../../../utils/testing/test-utils';
import ImageWithFallback from './ImageWithFallback';

describe('ImageWithFallback', () => {
  beforeEach(() => {
    setTestUser(undefined);
  });

  it('renders an image when an image is present', () => {
    const imgAlt = 'test-img';
    render(
      <ImageWithFallback
        imgUrl="/../src/utils/testing/test-image.png"
        imgAlt={imgAlt}
      />
    );

    const { queryByText, queryByAltText } = screen;
    expect(queryByAltText(imgAlt)).toBeInTheDocument();
    expect(queryByText('No Image')).not.toBeInTheDocument();
  });

  it('renders the fallback component when there is no image', () => {
    const imgAlt = 'test-img';
    render(<ImageWithFallback imgAlt={imgAlt} imgUrl={undefined} />);

    const { queryByText, queryByAltText } = screen;
    expect(queryByAltText(imgAlt)).not.toBeInTheDocument();
    expect(queryByText('No Image')).toBeInTheDocument();
  });
});
