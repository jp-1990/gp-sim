import { promises as fs } from 'fs';
import path from 'path';
import {
  CarsDataType,
  GaragesDataType,
  LiveriesDataType,
  UsersDataType
} from '../types';

import car from './car';
import garage from './garage';
import livery from './livery';
import user from './user';

const folder = 'db.cache' as const;

export enum CacheKeys {
  CAR = 'car.db',
  GARAGE = 'garage.db',
  LIVERY = 'livery.db',
  USER = 'user.db'
}

type Items = {
  [CacheKeys.CAR]: CarsDataType;
  [CacheKeys.GARAGE]: GaragesDataType;
  [CacheKeys.LIVERY]: LiveriesDataType;
  [CacheKeys.USER]: UsersDataType;
};

type NormalizedItems<T extends Items[CacheKeys]> = {
  ids: string[];
  entities: Record<string, T[number]>;
};

type NormalizeItems = <T extends Items[CacheKeys]>(
  items: T
) => NormalizedItems<T>;
const normalizeItems: NormalizeItems = (items) => {
  return (items as unknown as { id: string }[]).reduce(
    (res, item) => {
      res.ids.push(item.id);
      res.entities[item.id] = item;
      return res;
    },
    {
      ids: [],
      entities: {}
    } as { ids: string[]; entities: Record<string, any> }
  );
};

const db = {
  ...car,
  ...garage,
  ...livery,
  ...user,
  cache: {
    /**
     * Get items from the file system cache
     * @param key - key of {@link CacheKeys} to use to write data. type of items should match cache key
     * @returns items - array of cars, garages, liveries or users
     */
    get: async <T extends CacheKeys>(
      key: T
    ): Promise<Items[T] | null | undefined> => {
      try {
        const data = await fs.readFile(path.join(process.cwd(), folder, key), {
          encoding: 'utf8'
        });

        const normalizedItems: NormalizedItems<Items[T]> = JSON.parse(data);
        const items = normalizedItems.ids.map(
          (id) => normalizedItems.entities[id]
        );

        return items as unknown as Items[T];
      } catch (_) {
        return undefined;
      }
    },
    /**
     * Sets items to the file system cache. New items will replace existing items matched by id
     * @param items - array of cars, garages, liveries or users
     * @param key - key of {@link CacheKeys} to use to write data. type of items should match cache key
     */
    set: async <T extends CacheKeys>(items: Items[T], key: T) => {
      let existingItems: NormalizedItems<typeof items> = {
        ids: [],
        entities: {}
      };
      try {
        const data = await fs.readFile(path.join(process.cwd(), folder, key), {
          encoding: 'utf8'
        });
        existingItems = JSON.parse(data);
      } catch (_) {
        null;
      }

      const newItems = normalizeItems(items);

      const mergedItems: NormalizedItems<typeof items> = {
        ids: existingItems.ids,
        entities: existingItems.entities
      };

      mergedItems.ids = [...new Set([...newItems.ids, ...existingItems.ids])];
      for (const id of newItems.ids) {
        mergedItems.entities[id] = newItems.entities[id];
      }

      return await fs.writeFile(
        path.join(process.cwd(), folder, key),
        JSON.stringify(mergedItems),
        {
          encoding: 'utf8'
        }
      );
    }
  }
};

export default db;
