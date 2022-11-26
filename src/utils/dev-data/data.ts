/* eslint-disable @typescript-eslint/no-empty-function */
import fs from 'fs';
import { randomUUID } from 'crypto';
import { randomNumber } from './utils';
import { cars, names, tags, titles } from './values';

interface Creator {
  id: string;
  displayName: string;
  image: string;
}
interface Car {
  id: string;
  name: string;
  class: string;
}

const createUsersData = (n = 19) => {
  const users = [];
  for (let i = 0; i <= n; i++) {
    const name = names[randomNumber(0, 19)];
    const now = Date.now();

    const newUser = {
      id: `${i}`,
      createdAt: now,
      updatedAt: now,
      lastLogin: now,
      forename: name.split(' ')[0],
      surname: name.split(' ')[1],
      displayName: name,
      email: `${name.split(' ').join('.').toLowerCase()}@gmail.com`,
      about: `Hi, I am ${name}, and this is my profile! <br/> <br/>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Mauris mauris eros, euismod ut mi vitae, convallis iaculis
              quam. Pellentesque consectetur iaculis tortor vitae euismod.
              Integer malesuada congue elementum. Pellentesque vulputate
              diam dignissim elit hendrerit iaculis.`,
      image: `/car${randomNumber(1, 6)}.png`,
      garages: [] as string[],
      liveries: [] as string[]
    };
    users.push(newUser);
  }
  return users;
};

const createCarsData = () => {
  return cars.map((car, i) => ({
    id: `${i}`,
    name: car,
    class: 'GT4'
  }));
};

const createGarageData = ({
  id,
  creator
}: {
  id: string;
  creator: Creator;
}) => {
  const now = Date.now();
  const title = `${creator.displayName}'s Garage`;
  return {
    id: `${id}`,
    createdAt: now,
    updatedAt: now,
    creator,
    title,
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris mauris eros, euismod ut mi vitae, convallis iaculis
                  quam. Pellentesque consectetur iaculis tortor vitae euismod.
                  Integer malesuada congue elementum. Pellentesque vulputate
                  diam dignissim elit hendrerit iaculis.`,
    image: `/car${randomNumber(1, 6)}.png`,
    drivers: [creator.id],
    liveries: [] as string[]
  };
};

const createLiveryData = ({
  id,
  creator,
  cars
}: {
  id: string;
  creator: Creator;
  cars: Car[];
}) => {
  const now = Date.now();
  const title = titles[randomNumber(0, 21)];
  const searchTags = [
    tags[randomNumber(0, 10)],
    tags[randomNumber(0, 10)],
    tags[randomNumber(0, 10)]
  ];
  const isPublic = !!randomNumber(0, 1);
  return {
    id: `${id}`,
    createdAt: now,
    updatedAt: now,
    creator,
    title,
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris mauris eros, euismod ut mi vitae, convallis iaculis
                  quam. Pellentesque consectetur iaculis tortor vitae euismod.
                  Integer malesuada congue elementum. Pellentesque vulputate
                  diam dignissim elit hendrerit iaculis.`,
    car: cars[randomNumber(0, 10)].name,
    price: randomNumber(300, 5000),
    tags: searchTags.join(','),
    searchHelpers: Array.from(
      new Set([...searchTags, title, creator.displayName])
    ),
    isPublic,
    images: Array.from(
      new Set([
        `/car${randomNumber(1, 6)}.png`,
        `/car${randomNumber(1, 6)}.png`,
        `/car${randomNumber(1, 6)}.png`,
        `/car${randomNumber(1, 6)}.png`
      ])
    ),
    liveryFiles: `/test-livery-title.zip`,
    rating: randomNumber(0, 5),
    downloads: randomNumber(10, 2500)
  };
};

interface DevData {
  users: ReturnType<typeof createUsersData>;
  cars: ReturnType<typeof createCarsData>;
  garages: ReturnType<typeof createGarageData>[];
  liveries: ReturnType<typeof createLiveryData>[];
}
const devData: DevData = {
  users: createUsersData(),
  cars: createCarsData(),
  garages: [],
  liveries: []
};

// create garage, add to user
devData.users.forEach((user) => {
  const creator = {
    id: user.id,
    displayName: user.displayName,
    image: user.image
  };
  const id = randomUUID();
  const newGarage = createGarageData({ id, creator });
  devData.garages = [...devData.garages, newGarage];
  user.garages = [...user.garages, id];
});

// create (n) liveries, add to user and garage
devData.users.forEach((user) => {
  const creator = {
    id: user.id,
    displayName: user.displayName,
    image: user.image
  };
  const numberOfLiveries = randomNumber(0, 20);
  for (let i = 0; i <= numberOfLiveries; i++) {
    const id = randomUUID();
    const newLivery = createLiveryData({ id, creator, cars: devData.cars });
    user.liveries = Array.from(new Set([...user.liveries, id]));
    devData.liveries = [...devData.liveries, newLivery];

    const numberOfGarages = randomNumber(0, devData.garages.length - 1);
    for (let i = 0; i <= numberOfGarages; i++) {
      const garageIndex = randomNumber(0, devData.garages.length - 1);
      devData.garages[garageIndex].liveries = Array.from(
        new Set([...devData.garages[garageIndex].liveries, id])
      );
      devData.garages[garageIndex].drivers = Array.from(
        new Set([...devData.garages[garageIndex].drivers, user.id])
      );
      user.garages = Array.from(
        new Set([...user.garages, devData.garages[garageIndex].id])
      );
    }
  }
});

export const buildDevData = () => {
  fs.writeFile(
    './src/utils/dev-data/users.json',
    JSON.stringify(devData.users),
    () => {}
  );
  fs.writeFile(
    './src/utils/dev-data/cars.json',
    JSON.stringify(devData.cars),
    () => {}
  );
  fs.writeFile(
    './src/utils/dev-data/garages.json',
    JSON.stringify(devData.garages),
    () => {}
  );
  fs.writeFile(
    './src/utils/dev-data/liveries.json',
    JSON.stringify(devData.liveries),
    () => {}
  );
};
