import '@testing-library/jest-dom';
import { render, screen, setTestUser } from '../../../utils/testing/test-utils';
import { Table } from './Table';
import { TableDataTypes } from './types';
import { SELECT_ALL_CHECKBOX, getCheckboxAriaLabel } from './utils';

describe('Table', () => {
  beforeEach(() => {
    setTestUser(undefined);
  });

  const data = [
    {
      id: 0,
      name: 'alex',
      age: 20
    },
    {
      id: 1,
      name: 'billy',
      age: 30
    },
    {
      id: 2,
      name: 'carmen',
      age: 40
    }
  ];
  const columns = Object.keys(data[0])
    .map((key) => ({
      label: key.toUpperCase(),
      dataKey: key,
      type: TableDataTypes.STRING
    }))
    .filter(({ dataKey }) => dataKey !== 'id');

  const expectDataToBeInDocument = () => {
    expect(screen.getByText('NAME')).toBeInTheDocument();
    expect(screen.getByText('AGE')).toBeInTheDocument();
    expect(screen.getByText('alex')).toBeInTheDocument();
    expect(screen.getByText('billy')).toBeInTheDocument();
    expect(screen.getByText('carmen')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  };

  const expectCheckboxesToBeInDocument = () => {
    expect(screen.getByLabelText(SELECT_ALL_CHECKBOX)).toBeInTheDocument();
    expect(screen.getByLabelText(getCheckboxAriaLabel(0))).toBeInTheDocument();
    expect(screen.getByLabelText(getCheckboxAriaLabel(1))).toBeInTheDocument();
    expect(screen.getByLabelText(getCheckboxAriaLabel(2))).toBeInTheDocument();
  };

  it('renders data without checkbox or actions', () => {
    render(<Table<typeof data> columns={columns} data={data} />);

    expectDataToBeInDocument();
  });

  it('renders data with checkbox but no actions', () => {
    render(
      <Table<typeof data>
        columns={columns}
        data={data}
        selected={[]}
        onSelect={() => null}
      />
    );

    expectDataToBeInDocument();
    expectCheckboxesToBeInDocument();
  });

  it('renders data with actions but no checkboxes', () => {
    render(
      <Table<typeof data>
        columns={columns}
        data={data}
        actions={[({ id }) => <div aria-label={`${id}`}>{id}</div>]}
      />
    );

    expectDataToBeInDocument();
    expect(screen.getByLabelText('0')).toBeInTheDocument();
    expect(screen.getByLabelText('1')).toBeInTheDocument();
    expect(screen.getByLabelText('2')).toBeInTheDocument();
  });
});
