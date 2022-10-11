import '@testing-library/jest-dom';
import {
  render,
  screen,
  setMockCurrentUser
} from '../../../utils/testing/test-utils';
import { expectAllToBeInDocument } from '../../../utils/testing/helpers';
import Breadcrumbs from './Breadcrumbs';

describe('Breadcrumbs', () => {
  beforeEach(() => {
    setMockCurrentUser({ token: null, data: null, status: 'idle' });
  });

  const breadcrumbOptions = [
    { name: 'crumb-1', href: undefined },
    { name: 'crumb-2', href: undefined }
  ];

  it('renders the breadcrumbs', () => {
    render(<Breadcrumbs options={breadcrumbOptions} />);

    const crumbNames = breadcrumbOptions.map(({ name }) => name);
    expectAllToBeInDocument(crumbNames);
  });
});
