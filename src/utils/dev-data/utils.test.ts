import { applyLiveryFilters, applyGarageFilters } from './utils';

describe('apply livery filters function', () => {
  describe('filtering', () => {
    it('should filter by searchHelpers', () => {
      const search1 = 'blue';
      const result1 = applyLiveryFilters(liveriesData, [
        search1,
        null,
        null,
        null,
        null,
        null
      ]);

      expect(result1).toHaveLength(2);
      result1.forEach((livery) => {
        expect(
          livery.searchHelpers.find((el) => el.toLowerCase() === search1)
        ).not.toBeUndefined();
      });

      const search2 = 'not a tag';
      const result2 = applyLiveryFilters(liveriesData, [
        search2,
        null,
        null,
        null,
        null,
        null
      ]);

      expect(result2).toHaveLength(0);
      result2.forEach((livery) => {
        expect(
          livery.searchHelpers.find((el) => el.toLowerCase() === search2)
        ).toBeUndefined();
      });
    });
    it('should filter by car', () => {
      const car1 = 'Audi R8 LMS GT4';
      const result1 = applyLiveryFilters(liveriesData, [
        null,
        car1,
        null,
        null,
        null,
        null
      ]);

      expect(result1).toHaveLength(1);
      result1.forEach((livery) => {
        expect(livery.car).toEqual(car1);
      });
      const car2 = 'not a car';
      const result2 = applyLiveryFilters(liveriesData, [
        null,
        car2,
        null,
        null,
        null,
        null
      ]);

      expect(result2).toHaveLength(0);
      result2.forEach((livery) => {
        expect(livery.car).toEqual(car2);
      });
    });
    it('should filter by priceMin', () => {
      const price1 = '10.00';
      const result1 = applyLiveryFilters(liveriesData, [
        null,
        null,
        price1,
        null,
        null,
        null
      ]);

      expect(result1).toHaveLength(3);
      result1.forEach((livery) => {
        expect(livery.price).toBeGreaterThan(+price1 * 100);
      });
    });
    it('should filter by priceMax', () => {
      const price1 = '10.00';
      const result1 = applyLiveryFilters(liveriesData, [
        null,
        null,
        null,
        price1,
        null,
        null
      ]);

      expect(result1).toHaveLength(2);
      result1.forEach((livery) => {
        expect(livery.price).toBeLessThan(+price1 * 100);
      });
    });
    it('should filter by rating', () => {
      const rating1 = '3';
      const result1 = applyLiveryFilters(liveriesData, [
        null,
        null,
        null,
        null,
        null,
        rating1
      ]);

      expect(result1).toHaveLength(2);
      result1.forEach((livery) => {
        expect(livery.rating).toBeGreaterThanOrEqual(+rating1);
      });
    });
  });
  describe('ordering', () => {
    it('should order by createdAt', () => {
      const order1 = 'asc';
      const result1 = applyLiveryFilters(liveriesData, [
        null,
        null,
        null,
        null,
        order1,
        null
      ]);
      for (let i = 1, j = result1.length; i < j; i++) {
        expect(result1[i].createdAt).toBeLessThan(result1[i - 1].createdAt);
      }

      const order2 = 'desc';
      const result2 = applyLiveryFilters(liveriesData, [
        null,
        null,
        null,
        null,
        order2,
        null
      ]);
      for (let i = 1, j = result2.length; i < j; i++) {
        expect(result2[i].createdAt).toBeGreaterThan(result2[i - 1].createdAt);
      }
    });
    it('should order by price', () => {
      const priceMin1 = '0';
      const priceMax1 = '5000';

      const result1 = applyLiveryFilters(liveriesData, [
        null,
        null,
        priceMin1,
        priceMax1,
        null,
        null
      ]);
      for (let i = 1, j = result1.length; i < j; i++) {
        expect(result1[i].price).toBeLessThan(result1[i - 1].price as number);
      }
    });
    it('should order by rating', () => {
      const rating1 = '2';

      const result1 = applyLiveryFilters(liveriesData, [
        null,
        null,
        null,
        null,
        null,
        rating1
      ]);
      for (let i = 1, j = result1.length; i < j; i++) {
        expect(result1[i].rating).toBeLessThanOrEqual(
          result1[i - 1].rating as number
        );
      }
    });
  });
});

describe('apply garage filters function', () => {
  describe('filtering', () => {
    it('should filter by ids', () => {
      const ids =
        '431d885d-4041-4518-bc92-60e69a5d5a94&37517afc-70c4-416d-8f10-3473938e9221';
      const result = applyGarageFilters(garagesData, [ids, null]);

      expect(result).toHaveLength(2);
      const idsArray = ids.split('&');
      result.forEach((garage) => {
        expect(idsArray.includes(garage.id)).toBeTruthy();
      });
    });
  });
  describe('ordering', () => {
    it('should order by createdAt', () => {
      const order1 = 'asc';
      const result1 = applyGarageFilters(garagesData, [null, order1]);
      for (let i = 1, j = result1.length; i < j; i++) {
        expect(result1[i].createdAt).toBeLessThan(result1[i - 1].createdAt);
      }

      const order2 = 'desc';
      const result2 = applyGarageFilters(garagesData, [null, order2]);
      for (let i = 1, j = result2.length; i < j; i++) {
        expect(result2[i].createdAt).toBeGreaterThan(result2[i - 1].createdAt);
      }
    });
  });
});

const liveriesData = [
  {
    id: 'd03bfb4f-3b88-41ec-92bb-14b3438696ec',
    createdAt: 1651734649485,
    updatedAt: 1651734649485,
    creator: {
      id: '0',
      displayName: 'Julius Little',
      image: '/car2.png'
    },
    title: 'Harlequin',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n                  Mauris mauris eros, euismod ut mi vitae, convallis iaculis\n                  quam. Pellentesque consectetur iaculis tortor vitae euismod.\n                  Integer malesuada congue elementum. Pellentesque vulputate\n                  diam dignissim elit hendrerit iaculis.',
    car: 'Audi R8 LMS GT4',
    price: 598,
    tags: 'Red,2010s,Blue',
    searchHelpers: ['Red', '2010s', 'Blue', 'Harlequin', 'Julius Little'],
    isPublic: true,
    images: ['/car2.png', '/car5.png', '/car3.png', '/car6.png'],
    liveryFiles: '/test-livery-title.zip',
    rating: 3,
    downloads: 1965
  },
  {
    id: '46b7b672-2ce1-47b2-a0ce-a66acad40ae2',
    createdAt: 1651734649487,
    updatedAt: 1651734649487,
    creator: {
      id: '0',
      displayName: 'Julius Little',
      image: '/car2.png'
    },
    title: 'Saberteeth',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n                  Mauris mauris eros, euismod ut mi vitae, convallis iaculis\n                  quam. Pellentesque consectetur iaculis tortor vitae euismod.\n                  Integer malesuada congue elementum. Pellentesque vulputate\n                  diam dignissim elit hendrerit iaculis.',
    car: 'Aston Martin V8 Vantage GT4',
    price: 4755,
    tags: 'F1 remake,2010s,Blue',
    searchHelpers: [
      'F1 remake',
      '2010s',
      'Blue',
      'Saberteeth',
      'Julius Little'
    ],
    isPublic: false,
    images: ['/car5.png', '/car1.png', '/car2.png', '/car4.png'],
    liveryFiles: '/test-livery-title.zip',
    rating: 2,
    downloads: 449
  },
  {
    id: 'b936f9e3-95aa-4562-8066-f7ca29717602',
    createdAt: 1651734649486,
    updatedAt: 1651734649486,
    creator: {
      id: '0',
      displayName: 'Julius Little',
      image: '/car2.png'
    },
    title: 'Papa Alpaca',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n                  Mauris mauris eros, euismod ut mi vitae, convallis iaculis\n                  quam. Pellentesque consectetur iaculis tortor vitae euismod.\n                  Integer malesuada congue elementum. Pellentesque vulputate\n                  diam dignissim elit hendrerit iaculis.',
    car: 'Ginetta G55 GT4',
    price: 2331,
    tags: '2010s,Red,2000s',
    searchHelpers: ['2010s', 'Red', '2000s', 'Papa Alpaca', 'Julius Little'],
    isPublic: true,
    images: ['/car5.png', '/car3.png', '/car1.png'],
    liveryFiles: '/test-livery-title.zip',
    rating: 1,
    downloads: 2024
  },
  {
    id: 'e129b18d-e008-495d-9fd4-346eb18e60e5',
    createdAt: 1651734649489,
    updatedAt: 1651734649489,
    creator: {
      id: '0',
      displayName: 'Julius Little',
      image: '/car2.png'
    },
    title: 'Buffalo',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n                  Mauris mauris eros, euismod ut mi vitae, convallis iaculis\n                  quam. Pellentesque consectetur iaculis tortor vitae euismod.\n                  Integer malesuada congue elementum. Pellentesque vulputate\n                  diam dignissim elit hendrerit iaculis.',
    car: 'Alpine A110 GT4',
    price: 938,
    tags: 'LeMans remake,Red,Red',
    searchHelpers: ['LeMans remake', 'Red', 'Buffalo', 'Julius Little'],
    isPublic: false,
    images: ['/car6.png', '/car4.png', '/car5.png', '/car2.png'],
    liveryFiles: '/test-livery-title.zip',
    rating: 2,
    downloads: 2000
  },
  {
    id: 'd63cf4fd-9d7a-4d54-9eec-b583ef69c08d',
    createdAt: 1651734649483,
    updatedAt: 1651734649483,
    creator: {
      id: '0',
      displayName: 'Julius Little',
      image: '/car2.png'
    },
    title: 'Thunder Storm',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n                  Mauris mauris eros, euismod ut mi vitae, convallis iaculis\n                  quam. Pellentesque consectetur iaculis tortor vitae euismod.\n                  Integer malesuada congue elementum. Pellentesque vulputate\n                  diam dignissim elit hendrerit iaculis.',
    car: 'Alpine A110 GT4',
    price: 4049,
    tags: '2010s,90s,Green',
    searchHelpers: ['2010s', '90s', 'Green', 'Thunder Storm', 'Julius Little'],
    isPublic: false,
    images: ['/car3.png', '/car6.png', '/car4.png'],
    liveryFiles: '/test-livery-title.zip',
    rating: 4,
    downloads: 1583
  }
];

const garagesData = [
  {
    id: '431d885d-4041-4518-bc92-60e69a5d5a94',
    createdAt: 1651734649485,
    updatedAt: 1651734649485,
    creator: {
      id: '0',
      displayName: 'Julius Little',
      image: '/car2.png'
    },
    title: "Julius Little's Garage",
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n                  Mauris mauris eros, euismod ut mi vitae, convallis iaculis\n                  quam. Pellentesque consectetur iaculis tortor vitae euismod.\n                  Integer malesuada congue elementum. Pellentesque vulputate\n                  diam dignissim elit hendrerit iaculis.',
    image: '/car3.png',
    drivers: [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19'
    ],
    liveries: [
      '46b7b672-2ce1-47b2-a0ce-a66acad40ae2',
      'e129b18d-e008-495d-9fd4-346eb18e60e5',
      'ec5ca764-93b1-4c26-928d-b9ce723b3988',
      '9a52da51-fbea-448c-adc8-1f9163edd5f0',
      '8faa5b64-523e-4a28-908a-04583003acc3',
      '9ab1fd36-cb29-4238-9456-3e6f0795cbcb',
      '4eacf198-a6fb-44ab-8809-14f2344f58da',
      'de59aeb8-6a11-4efc-aeb2-53217b88c753',
      'f5a9941a-28cc-48f1-943a-b813cf364469',
      '7bf02662-d69c-409b-83d2-aa8427f10de2',
      'f29f1482-081f-4116-a51f-102276b1d736',
      '5d33cdac-4fae-4aac-8193-515054d2c20b',
      '0f5bea01-cf3a-4452-b340-6736f252c73d',
      '9d58dab1-7a50-441a-ad6e-94a9b42732da',
      'b85374c9-4978-4870-9388-421c2d9f6a47',
      'e3498ce7-fef6-49d2-8f29-f7355d84af2a',
      'f03aa120-ff2d-46b8-98f8-48b756611253',
      '70c5413d-a909-45c5-a27e-4d15cb448bed',
      'a119e820-dd55-4d16-a0c7-35d1c2fee65c',
      '07adadae-7488-47ff-b4f4-ecc9f23eaf42',
      'ba24a9bd-f67b-45a9-9cc8-24fcd3420ba2',
      '805298b1-547d-4a2f-8106-d1495a3ee398',
      '5e702421-c54a-4c66-a035-4556cfd7a3a0',
      'ca773b51-016a-4b24-b2ad-18966abf479d',
      '493d1424-7004-41c0-b287-0ef850ad9758',
      'fb82bff8-f440-4992-8d20-200dc788243e',
      '4a63e52e-b46c-4bf2-9b57-5c522129ebb1',
      '63764357-0222-43b0-8075-93d9b5eda237',
      'e02232d3-5421-4ed3-a550-99efa3612979',
      'a4b3d24b-b425-476a-8109-293f4c13c518',
      '6657b45e-9268-4807-860d-4a8390a15814',
      '7c9d08ae-2340-4aa3-81f4-11849d6041bf',
      'da36626d-ef54-4050-9cf2-d8cd1590316f',
      'e01b81d0-4784-465c-8661-639233e2709b',
      'e6d6432e-fc68-4418-a213-f07f9aad9d1c',
      '235c764a-779c-4179-9b7a-48a09011e122',
      '9fbca1b4-b4cf-4afe-b6ac-93d3f5b256da',
      '62ad4f3f-53ea-4266-b444-9347f1fbdd7b',
      'b89a269e-7c57-4ef3-910e-7fa99708ab3d',
      '3892ade7-4a05-4510-9c4d-196cd46c37f9',
      '4bf7eed8-247f-4e88-a036-2a76a8c2ad37',
      '73785034-51f2-4275-91c0-e2ffbd1e23fe',
      '4c350e24-b187-4174-b746-75a72465328a',
      '0ebdf6cb-f61e-4ba6-ba05-1d5fb8f9e3de',
      'e61603cd-544e-4174-9df2-9e260a2da018',
      'bbb2e744-9fad-4965-b52c-7bb7494fc505',
      '2cf6c9f8-fec3-462c-a3bf-c6e9641d6b4a',
      '1f310e3e-65a7-43f5-9f14-7f5235ffb134',
      'f80d162c-8910-43cc-8851-8ea5cf4732e7',
      '77d19a65-9ea3-4206-885f-7082b317559e',
      'cd8cdb44-6812-45f9-a6a4-d53b81a78e71',
      'ad261b5c-6536-4d28-9640-6e3d9909039d',
      '89055154-9e2a-4c9b-8631-4223fe077189',
      'd5ed30bd-04e2-40b5-9e52-988cc1cf88d3',
      'c451c2e4-d2d7-4aa1-8b93-7f9946c2fded',
      '87977b96-943f-4d4d-8c06-225d4d8ead01',
      'db3b2f55-52ab-4890-b5fb-2d164fb9fc9c',
      'c23626a6-8b1a-4053-86ea-3a0d50154211',
      '4e3b643f-ddcd-42ea-ab08-9337c6c4228d',
      '31258961-ff57-4f32-97cd-f221be568c99',
      '627e225e-beca-4c89-8ed7-e246adab5a8a',
      '70b051b0-dc44-4e74-90e4-35f8367e7666',
      '04d5b414-5f29-4c8b-9a33-21d2b6fd0376',
      '1b618f2c-60c3-4311-8c59-2ccb644cc0c9',
      'bb7d1d4f-7a97-4442-97a1-2a3e089c3ca3',
      'efae3a6a-a467-423e-9ebb-51ecb76bc2fb',
      '4d0c608a-c04d-4fd1-b135-357b92caa614',
      '17b95b7b-d34b-4b9c-8462-e0b952bbf4e7',
      'aa50d1cc-5a99-40ef-bccd-55c8a326edee',
      'f11310b9-f39e-4962-aebf-487a5299b413',
      'cf90ac48-7691-4acd-b5b5-75b6f318efcc',
      'dccc9a39-9f57-4d26-9aa7-e3e59025c667',
      'cd6ecad6-d63e-41c8-b778-21808e920817',
      'acc32d4c-4864-47ea-8a2d-1d87297718c9',
      '2651e6f4-92ca-4154-a754-cc8433107fd3',
      '68a368cd-92e4-4cac-b5a9-6ff9ffe081a2',
      'd60e00ba-adbc-4f5f-bb80-7fb1fb852b8d',
      '8eb9cddb-b582-4d6a-a987-16fe47db37e7',
      'd703cc9f-7552-4f76-a629-c49bbb383185',
      '2636bfb9-f6d8-4613-928c-683b19f4293b',
      'b4695236-61a6-412e-b927-760b9010fc2e',
      '45608122-e178-4704-b058-9121f2ec42d4',
      'c4a061a6-b8d7-43cd-a1f8-041f5cc10ae5',
      'e780e82c-a44f-4ff7-84be-d6380aa8e203',
      '5799d265-86dd-4cf3-9653-f8219bc04fc0',
      '3b367180-ee18-49cc-ac27-a6d0e2c65481',
      '098f69a0-485d-458e-9b29-ac892db367fc'
    ]
  },
  {
    id: '37517afc-70c4-416d-8f10-3473938e9221',
    createdAt: 1651734649484,
    updatedAt: 1651734649484,
    creator: {
      id: '1',
      displayName: 'Angel Willis',
      image: '/car6.png'
    },
    title: "Angel Willis's Garage",
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n                  Mauris mauris eros, euismod ut mi vitae, convallis iaculis\n                  quam. Pellentesque consectetur iaculis tortor vitae euismod.\n                  Integer malesuada congue elementum. Pellentesque vulputate\n                  diam dignissim elit hendrerit iaculis.',
    image: '/car4.png',
    drivers: [
      '1',
      '0',
      '2',
      '3',
      '4',
      '5',
      '6',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19'
    ],
    liveries: [
      'e129b18d-e008-495d-9fd4-346eb18e60e5',
      'd63cf4fd-9d7a-4d54-9eec-b583ef69c08d',
      '2893ade3-1456-40a0-bca4-29fb125656a4',
      'ec5ca764-93b1-4c26-928d-b9ce723b3988',
      '8faa5b64-523e-4a28-908a-04583003acc3',
      '9ab1fd36-cb29-4238-9456-3e6f0795cbcb',
      'de59aeb8-6a11-4efc-aeb2-53217b88c753',
      '7bf02662-d69c-409b-83d2-aa8427f10de2',
      'f29f1482-081f-4116-a51f-102276b1d736',
      '962a5b1e-1c94-4a21-820c-6daf6b98a272',
      'd8ac6c99-84c1-4f6c-8b7f-7ce7926615fa',
      'bb2c0fc7-87b7-4a26-be92-d0eca807ffb1',
      'ac90c37c-2407-4f98-86fe-9e25bfaf6727',
      '70c5413d-a909-45c5-a27e-4d15cb448bed',
      'ba24a9bd-f67b-45a9-9cc8-24fcd3420ba2',
      '0625fdf6-62c7-47f8-82b2-5fb6b98e351c',
      '805298b1-547d-4a2f-8106-d1495a3ee398',
      '5e702421-c54a-4c66-a035-4556cfd7a3a0',
      'ca773b51-016a-4b24-b2ad-18966abf479d',
      '493d1424-7004-41c0-b287-0ef850ad9758',
      'a0767d51-cf8a-45da-a028-7a0d54740741',
      '71f0d07f-6a83-4273-b50f-f44e8657481b',
      'fb82bff8-f440-4992-8d20-200dc788243e',
      '4a63e52e-b46c-4bf2-9b57-5c522129ebb1',
      '63764357-0222-43b0-8075-93d9b5eda237',
      '7c9d08ae-2340-4aa3-81f4-11849d6041bf',
      'fec2aaa2-f6ef-48b9-8a37-04040c18240a',
      '9fbca1b4-b4cf-4afe-b6ac-93d3f5b256da',
      '62ad4f3f-53ea-4266-b444-9347f1fbdd7b',
      '6537e40c-69ab-425a-9be8-3a121ddc3639',
      '3892ade7-4a05-4510-9c4d-196cd46c37f9',
      '9ebecce9-b141-4f39-a460-848dc95c503b',
      '4c350e24-b187-4174-b746-75a72465328a',
      '1e187e4c-62db-4390-bcf4-4e4e77bfe525',
      'dfd7b1fb-3a69-4931-bdc9-168933b1f670',
      '68a7e625-c790-40bd-b782-97db4c8b3a6b',
      '0ebdf6cb-f61e-4ba6-ba05-1d5fb8f9e3de',
      '75bde498-5986-400e-ac28-58bea23b5f33',
      '7bd9809e-9316-438a-b0b8-083f44096c2f',
      '93c50338-4881-4bc6-bdeb-0ac8b47060be',
      '77d19a65-9ea3-4206-885f-7082b317559e',
      '89055154-9e2a-4c9b-8631-4223fe077189',
      'd4fa9cca-269a-4b1c-954c-4890bc2ddafb',
      'aa699f31-e660-4595-adb9-04fdec87070f',
      'd5ed30bd-04e2-40b5-9e52-988cc1cf88d3',
      'db3b2f55-52ab-4890-b5fb-2d164fb9fc9c',
      'cb071e73-dc1f-4da1-a4ea-4b0ab2860344',
      'c23626a6-8b1a-4053-86ea-3a0d50154211',
      '4e3b643f-ddcd-42ea-ab08-9337c6c4228d',
      '31258961-ff57-4f32-97cd-f221be568c99',
      'f3d378d0-5534-4e91-a8a3-fc77a2c50a61',
      '79885794-f907-4bd4-b616-b8139cd2eba0',
      '1439c369-523f-4284-9a43-49c5e1f14f5f',
      '279f3a30-5c93-468a-8dca-6aadecfe968a',
      'bb7d1d4f-7a97-4442-97a1-2a3e089c3ca3',
      '4d0c608a-c04d-4fd1-b135-357b92caa614',
      'cf90ac48-7691-4acd-b5b5-75b6f318efcc',
      'dccc9a39-9f57-4d26-9aa7-e3e59025c667',
      'cd6ecad6-d63e-41c8-b778-21808e920817',
      'b17f0c0b-fddc-4066-a59c-deeccbcacefd',
      'b3bd495a-1c03-42aa-8235-9d714777cdfa',
      '2651e6f4-92ca-4154-a754-cc8433107fd3',
      '68a368cd-92e4-4cac-b5a9-6ff9ffe081a2',
      'd703cc9f-7552-4f76-a629-c49bbb383185',
      'e633cff0-3e5d-4974-9861-59ba7797bb5f',
      '4d688569-9a6f-4deb-8a5c-211e7bd25686',
      'ac126814-7b43-4ae0-9f52-b018efc0b127',
      'a57611d8-eafe-40b8-9792-2b965d6210bf',
      '80112e64-2be0-4766-a4ad-4245b4171294',
      '5799d265-86dd-4cf3-9653-f8219bc04fc0',
      '2ef7cec8-440c-41ba-8520-8a1c675243b5',
      'a02e5e5e-2c81-4446-892c-99b5df33570b',
      '3b367180-ee18-49cc-ac27-a6d0e2c65481',
      '6629480d-efa6-4750-bd27-40d15139b324',
      'fc3a8374-6b24-4bca-ad53-bae19487a34d',
      '098f69a0-485d-458e-9b29-ac892db367fc'
    ]
  },
  {
    id: '44702405-8231-43ec-9409-b28994c74fad',
    createdAt: 1651734649486,
    updatedAt: 1651734649486,
    creator: {
      id: '2',
      displayName: 'Angel Willis',
      image: '/car5.png'
    },
    title: "Angel Willis's Garage",
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n                  Mauris mauris eros, euismod ut mi vitae, convallis iaculis\n                  quam. Pellentesque consectetur iaculis tortor vitae euismod.\n                  Integer malesuada congue elementum. Pellentesque vulputate\n                  diam dignissim elit hendrerit iaculis.',
    image: '/car6.png',
    drivers: [
      '2',
      '0',
      '1',
      '3',
      '4',
      '5',
      '6',
      '8',
      '9',
      '10',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19'
    ],
    liveries: [
      '46b7b672-2ce1-47b2-a0ce-a66acad40ae2',
      'd63cf4fd-9d7a-4d54-9eec-b583ef69c08d',
      '91b41272-0b4e-401b-9f11-f4d101ebf320',
      '101031e2-5973-48ac-8a85-8990e91c534b',
      '7dc639d3-ba6b-4758-a48d-85631aed0a53',
      '9a52da51-fbea-448c-adc8-1f9163edd5f0',
      'd0b88de0-dfbc-4d0f-b6b8-edb3a6137caa',
      '9ab1fd36-cb29-4238-9456-3e6f0795cbcb',
      'de59aeb8-6a11-4efc-aeb2-53217b88c753',
      '7bf02662-d69c-409b-83d2-aa8427f10de2',
      'f29f1482-081f-4116-a51f-102276b1d736',
      '0ccc91b3-7198-4ff1-a706-03385e73f7e1',
      '962a5b1e-1c94-4a21-820c-6daf6b98a272',
      '0f5bea01-cf3a-4452-b340-6736f252c73d',
      '9d58dab1-7a50-441a-ad6e-94a9b42732da',
      'bb2c0fc7-87b7-4a26-be92-d0eca807ffb1',
      'bce3d31f-2f63-44c3-83e7-1e3e8a5e6d12',
      'f03aa120-ff2d-46b8-98f8-48b756611253',
      '70c5413d-a909-45c5-a27e-4d15cb448bed',
      'a119e820-dd55-4d16-a0c7-35d1c2fee65c',
      '07adadae-7488-47ff-b4f4-ecc9f23eaf42',
      'ba24a9bd-f67b-45a9-9cc8-24fcd3420ba2',
      '0625fdf6-62c7-47f8-82b2-5fb6b98e351c',
      'efe978ca-7c45-46e3-8181-4cf6be43031b',
      '805298b1-547d-4a2f-8106-d1495a3ee398',
      '53a9ad04-cee8-43fa-a826-c5b2417099eb',
      'ca773b51-016a-4b24-b2ad-18966abf479d',
      '53bd069b-5fde-4d6d-b89d-4c1506d2892a',
      '283be034-dc94-4143-80aa-d836d9d3a686',
      '572fd610-6b05-40c1-a2ee-dd0e28d46925',
      'a0da6776-a2ca-4998-bd70-b55cf49e6b26',
      '4a63e52e-b46c-4bf2-9b57-5c522129ebb1',
      '63764357-0222-43b0-8075-93d9b5eda237',
      '6657b45e-9268-4807-860d-4a8390a15814',
      '7c9d08ae-2340-4aa3-81f4-11849d6041bf',
      '90cd3ceb-8168-4e6c-99b4-fe953cdad919',
      'e6d6432e-fc68-4418-a213-f07f9aad9d1c',
      '235c764a-779c-4179-9b7a-48a09011e122',
      'fec2aaa2-f6ef-48b9-8a37-04040c18240a',
      '9fbca1b4-b4cf-4afe-b6ac-93d3f5b256da',
      '6537e40c-69ab-425a-9be8-3a121ddc3639',
      '3892ade7-4a05-4510-9c4d-196cd46c37f9',
      '9ebecce9-b141-4f39-a460-848dc95c503b',
      'dfd7b1fb-3a69-4931-bdc9-168933b1f670',
      'e61603cd-544e-4174-9df2-9e260a2da018',
      '2cf6c9f8-fec3-462c-a3bf-c6e9641d6b4a',
      'eb1fb256-1b15-4dca-a44e-3af3250fdbde',
      '1f310e3e-65a7-43f5-9f14-7f5235ffb134',
      'f80d162c-8910-43cc-8851-8ea5cf4732e7',
      '76a68a68-50a2-4b8f-9fd9-fbbb4f1cad59',
      '77d19a65-9ea3-4206-885f-7082b317559e',
      'ad261b5c-6536-4d28-9640-6e3d9909039d',
      '89055154-9e2a-4c9b-8631-4223fe077189',
      'd4fa9cca-269a-4b1c-954c-4890bc2ddafb',
      'a0c118e5-6657-4089-ab1b-419f48f3b3ef',
      '18a6b489-9ca0-4c07-970f-a1368b540bf9',
      '87977b96-943f-4d4d-8c06-225d4d8ead01',
      'c23626a6-8b1a-4053-86ea-3a0d50154211',
      '01582d3d-ab68-47a7-afa9-8fd988b1d03d',
      '58fde019-0045-46e0-a7c6-616adfef585f',
      'b6e9761d-4c1d-4766-adbf-92768fd3d030',
      'd0f056bc-144f-41fa-9e18-b80e5285b20d',
      '70b051b0-dc44-4e74-90e4-35f8367e7666',
      'b33f712d-2948-489d-abce-96719306bae5',
      '79885794-f907-4bd4-b616-b8139cd2eba0',
      '589477a8-a63b-4238-aaa7-97aa3f126594',
      'be5d34b7-bf97-45b3-bb2d-31b7521cf6af',
      'efae3a6a-a467-423e-9ebb-51ecb76bc2fb',
      '17b95b7b-d34b-4b9c-8462-e0b952bbf4e7',
      '8227d229-5d97-4950-b787-a54ecfebeb1e',
      '21b5f8f5-44b7-4d65-badd-773527588f03',
      'cd6ecad6-d63e-41c8-b778-21808e920817',
      'b17f0c0b-fddc-4066-a59c-deeccbcacefd',
      'e633cff0-3e5d-4974-9861-59ba7797bb5f',
      '2636bfb9-f6d8-4613-928c-683b19f4293b',
      'aeb2b643-38b7-47aa-981b-3c469418e7b3',
      'b4695236-61a6-412e-b927-760b9010fc2e',
      'cbc6f36b-2f46-4e63-9308-72ca9ed64758',
      'a57611d8-eafe-40b8-9792-2b965d6210bf',
      'beeccf3e-f8aa-4597-a153-5a29ca69f3f4',
      '3b367180-ee18-49cc-ac27-a6d0e2c65481',
      'afefba17-50d1-418a-bf5e-b9143e90f8bd',
      '098f69a0-485d-458e-9b29-ac892db367fc'
    ]
  }
];
