import React from 'react';
import { EntityState } from '@reduxjs/toolkit';
import {
  chakra,
  ComponentWithAs,
  Grid,
  ChakraProps,
  GridItem
} from '@chakra-ui/react';
import { LiveryDataType } from '../../../../types';
import LiveryCard from '../LiveryCard/LiveryCard';

interface Props {
  liveries: EntityState<LiveryDataType> | undefined;
  onClickLivery?: (livery: LiveryDataType) => void;
}
const LiveryList: ComponentWithAs<'section', ChakraProps & Props> = ({
  liveries,
  onClickLivery,
  ...chakraProps
}) => {
  return (
    <chakra.section pt={9} {...chakraProps}>
      <Grid templateColumns="repeat(3, 1fr)" gap={4} w="5xl">
        {liveries?.ids.map((e) => {
          const target = liveries?.entities[e.valueOf()];
          if (!target) return null;
          const onClick = onClickLivery
            ? () => onClickLivery(target)
            : undefined;
          const { id, creator, rating, title, car, images, price } = target;
          return (
            <GridItem key={e} colSpan={1}>
              <LiveryCard
                car={car}
                creator={creator}
                rating={rating}
                id={id}
                image={images[0]}
                price={price}
                title={title}
                onClick={onClick}
              />
            </GridItem>
          );
        })}
      </Grid>
    </chakra.section>
  );
};

export default React.memo(LiveryList);
