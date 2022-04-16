import '@testing-library/jest-dom';
import {
  render,
  screen,
  setTestUser,
  fireEvent
} from '../../../utils/testing/test-utils';
import {
  expectAllToBeInDocument,
  expectAllToNotBeInDocument
} from '../../../utils/testing/helpers';
import { commonStrings, profileStrings } from '../../../utils/intl';
import { messages } from './MainLayout.messages';
import MainLayout from './MainLayout';

const { paintshop, garages } = commonStrings;
const { profile, viewProfile, myGarages, myLiveries } = profileStrings;
const { login, logout } = messages;

describe('MainLayout', () => {
  beforeEach(() => {
    setTestUser(undefined);
  });

  it('renders correct header items with no logged in user', () => {
    render(<MainLayout pageDescription="" />);
    const { getByText, getByRole } = screen;

    expect(getByText(paintshop.defaultMessage)).toBeInTheDocument();
    expect(getByRole('button')).toHaveTextContent(login.defaultMessage);
  });

  it('renders correct header items with logged in user', () => {
    setTestUser({ name: 'testing-user' });

    render(<MainLayout pageDescription="" />);
    const { getByText, getByRole } = screen;

    expect(getByText(paintshop.defaultMessage)).toBeInTheDocument();
    expect(getByText(garages.defaultMessage)).toBeInTheDocument();
    expect(getByRole('button')).toHaveTextContent(profile.defaultMessage);
  });

  it('renders menu when profile is clicked with a logged in user', () => {
    setTestUser({ name: 'testing-user' });
    render(<MainLayout pageDescription="" />);
    const { getByText, getByRole } = screen;

    const profileButton = getByRole('button');

    expect(getByText(paintshop.defaultMessage)).toBeInTheDocument();
    expect(getByText(garages.defaultMessage)).toBeInTheDocument();
    expect(profileButton).toHaveTextContent(profile.defaultMessage);

    const itemsToFind = [
      viewProfile.defaultMessage,
      myGarages.defaultMessage,
      myLiveries.defaultMessage,
      logout.defaultMessage
    ];
    expectAllToNotBeInDocument(itemsToFind);
    fireEvent.click(profileButton);
    expectAllToBeInDocument(itemsToFind);
  });

  it('renders a footer', () => {
    render(<MainLayout pageDescription="" />);
    const { getByRole } = screen;

    expect(getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders child components', () => {
    const string1 = 'testing-content-1';
    const string2 = 'testing-content-2';

    render(
      <MainLayout pageDescription="">
        <div>{string1}</div>
        <div>{string2}</div>
      </MainLayout>
    );
    const { getByText } = screen;

    expect(getByText(string1)).toBeInTheDocument();
    expect(getByText(string2)).toBeInTheDocument();
  });
});
