import { screen } from './test-utils';

export const expectAllToBeInDocument = (strings: string[]) => {
  strings.forEach((string) => {
    expect(screen.queryByText(string)).toBeInTheDocument();
  });
};

export const expectAllToNotBeInDocument = (strings: string[]) => {
  strings.forEach((string) => {
    expect(screen.queryByText(string)).not.toBeInTheDocument();
  });
};
