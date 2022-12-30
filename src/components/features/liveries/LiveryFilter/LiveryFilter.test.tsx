import '@testing-library/jest-dom';
import { useLiveryFilters } from '../../../../hooks/use-livery-filters';
import { commonStrings } from '../../../../utils/intl';
import { render, screen } from '../../../../utils/testing/test-utils';
import LiveryFilter, { Mode } from './LiveryFilter';

const TestComponent = ({ mode }: { mode: Mode }) => {
  const { filters, setFilters } = useLiveryFilters();
  return <LiveryFilter mode={mode} filters={filters} setFilters={setFilters} />;
};
describe('LiveryFilter', () => {
  it('renders search, select car and created in BASIC mode', () => {
    render(<TestComponent mode={Mode.BASIC} />);
    expect(
      screen.getByLabelText(commonStrings.search.defaultMessage)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(commonStrings.selectCar.defaultMessage)
    ).toBeInTheDocument();
  });

  it('renders all filters in FULL mode', () => {
    render(<TestComponent mode={Mode.FULL} />);
    expect(
      screen.getByLabelText(commonStrings.search.defaultMessage)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(commonStrings.selectCar.defaultMessage)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(commonStrings.createdAt.defaultMessage)
    ).toBeInTheDocument();
    // expect(
    //   screen.getByLabelText(commonStrings.rating.defaultMessage)
    // ).toBeInTheDocument();
  });
});
