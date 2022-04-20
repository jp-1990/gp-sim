import { StarIcon } from '@chakra-ui/icons';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

const STAR_ICON = 'star-icon';
const FILLED = 'filled';
const DEFAULT = 'default';
export const FILLED_STAR = `${STAR_ICON}-${FILLED}`;
export const DEFAULT_STAR = `${STAR_ICON}-${DEFAULT}`;

interface Props {
  rating?: number;
  color?: string;
  alignItems?: 'flex-end' | 'flex-start';
}
/**
 *
 * @param {Props['rating']} props.rating - number. The number of icons to be highlighted.
 * @param {Props['color']} props.color - string. The color of the highlighted items.
 * @param {Props['alignItems']} props.alignItems - 'flex-end' | 'flex-start'. Left or right align the icons.
 * @returns Function Component
 *
 * @description Renders 5 starts. The color of each star relates to the number present in the rating prop (rating = 3, 3 stars will be highlighted).
 */
const Rating: React.FC<Props> = ({
  color = 'red',
  rating,
  alignItems = 'flex-end'
}) => {
  return (
    <Flex
      direction="column"
      alignItems={alignItems}
      justifyContent="flex-start"
      h="full"
    >
      {rating !== undefined && (
        <Box display="flex" alignItems="center">
          {Array(5)
            .fill('')
            .map((_, i) => (
              <StarIcon
                data-testid={`${STAR_ICON}-${
                  i > 4 - rating ? FILLED : DEFAULT
                }`}
                key={i}
                mx={0.5}
                color={i > 4 - rating ? color : 'gray.200'}
              />
            ))}
        </Box>
      )}
    </Flex>
  );
};

export default Rating;
