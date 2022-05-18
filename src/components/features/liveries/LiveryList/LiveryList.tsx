import React from 'react';
import { EntityState } from '@reduxjs/toolkit';
import { chakra, ComponentWithAs, Grid, ChakraProps } from '@chakra-ui/react';
import { LiveryDataType } from '../../../../types';
import LiveryCard from '../LiveryCard/LiveryCard';

interface Props {
  liveries: EntityState<LiveryDataType> | undefined;
  itemsPerPage?: number;
}
const LiveryList: ComponentWithAs<'section', ChakraProps & Props> = ({
  liveries,
  itemsPerPage,
  ...chakraProps
}) => {
  return (
    <chakra.section pt={9} {...chakraProps}>
      <Grid
        templateColumns="repeat(3, 1fr)"
        templateRows="repeat(3, 1fr)"
        gap={4}
        w="5xl"
      >
        {liveries?.ids.map((e) => {
          const target = liveries?.entities[e.valueOf()];
          if (!target) return null;
          const { id, creator, rating, title, car, images, price } = target;
          return (
            <LiveryCard
              key={e}
              car={car}
              creator={creator}
              rating={rating}
              id={id}
              image={images[0]}
              price={price}
              title={title}
            />
          );
        })}
      </Grid>
    </chakra.section>
  );
};

export default React.memo(LiveryList);
