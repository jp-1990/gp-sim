import React from 'react';
import { FormattedMessage } from 'react-intl';

import { SubmitButton, useForm } from '../../../shared';
import { liveryStrings } from '../../../../utils/intl';

const LiverySubmit = () => {
  const { state } = useForm();

  const onClick = () => console.log(state);

  return (
    <SubmitButton onClick={onClick} colorScheme="red" w="2xs" lineHeight={1}>
      {<FormattedMessage {...liveryStrings.uploadLivery} />}
    </SubmitButton>
  );
};

export default LiverySubmit;
