import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Tags } from '../../../shared';
import { formStrings } from '../../../../utils/intl';
import { stateKeys, validators } from '../config';
import { Flex } from '@chakra-ui/react';
import { Tag } from '../../../core';

const LiverySearchTags = () => {
  const intl = useIntl();
  return (
    <Tags<typeof stateKeys.SEARCH_TAGS>
      validators={validators.searchTags}
      stateKey={stateKeys.SEARCH_TAGS}
      label={<FormattedMessage {...formStrings.searchTags} />}
      placeholder={intl.formatMessage({
        ...formStrings.searchTagsPlaceholder
      })}
      w={48}
    >
      {(state) => {
        if (!state) return null;
        const { [stateKeys.SEARCH_TAGS]: tags } = state;
        const tagsArray = tags.split(',').filter((e) => e.trim());
        return (
          <Flex mt={2}>
            {tagsArray.map((tag, i) => {
              return <Tag key={tag + i} tag={tag} />;
            })}
          </Flex>
        );
      }}
    </Tags>
  );
};

export default LiverySearchTags;
