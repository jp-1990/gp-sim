import { defineMessages } from 'react-intl';

// react-intl doesn't like template literals
// scope = `utils.intl.form`;

const invalidField = {
  invalidInput: {
    id: 'utils.intl.form.invalidInput',
    defaultMessage: 'Invalid input'
  },
  fieldNull: {
    id: 'utils.intl.form.fieldNull',
    defaultMessage: 'This field is required'
  }
};

export const formStrings = defineMessages({
  ...invalidField
});
