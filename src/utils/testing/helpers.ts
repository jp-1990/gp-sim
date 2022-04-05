import { screen } from './test-utils';

export const expectAllToBeInDocument = (stirngs: string[]) => {
  stirngs.forEach((string) => {
    expect(screen.queryByText(string)).toBeInTheDocument();
  });
};

export const expectAllToNotBeInDocument = (stirngs: string[]) => {
  stirngs.forEach((string) => {
    expect(screen.queryByText(string)).not.toBeInTheDocument();
  });
};
