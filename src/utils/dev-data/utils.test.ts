import { applyFilters } from './utils';

describe('apply filters function', () => {
  describe('filtering', () => {
    it('should filter by searchHelpers', () => {
      const search1 = 'blue';
      const result1 = applyFilters(data, [search1]);

      expect(result1).toHaveLength(2);
      result1.forEach((livery) => {
        expect(
          livery.searchHelpers.find((el) => el.toLowerCase() === search1)
        ).not.toBeUndefined();
      });

      const search2 = 'not a tag';
      const result2 = applyFilters(data, [search2]);

      expect(result2).toHaveLength(0);
      result2.forEach((livery) => {
        expect(
          livery.searchHelpers.find((el) => el.toLowerCase() === search2)
        ).toBeUndefined();
      });
    });
    it('should filter by car', () => {
      const car1 = 'Audi R8 LMS GT4';
      const result1 = applyFilters(data, [null, car1]);

      expect(result1).toHaveLength(1);
      result1.forEach((livery) => {
        expect(livery.car).toEqual(car1);
      });
      const car2 = 'not a car';
      const result2 = applyFilters(data, [null, car2]);

      expect(result2).toHaveLength(0);
      result2.forEach((livery) => {
        expect(livery.car).toEqual(car2);
      });
    });
    it('should filter by priceMin', () => {
      const price1 = '10.00';
      const result1 = applyFilters(data, [null, null, price1]);

      expect(result1).toHaveLength(3);
      result1.forEach((livery) => {
        expect(livery.price).toBeGreaterThan(+price1 * 100);
      });
    });
    it('should filter by priceMax', () => {
      const price1 = '10.00';
      const result1 = applyFilters(data, [null, null, null, price1]);

      expect(result1).toHaveLength(2);
      result1.forEach((livery) => {
        expect(livery.price).toBeLessThan(+price1 * 100);
      });
    });
    it('should filter by rating', () => {
      const rating1 = '3';
      const result1 = applyFilters(data, [
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
    it('should filter by quantity', () => {
      const quantity1 = '4';
      const result1 = applyFilters(data, [
        null,
        null,
        null,
        null,
        null,
        null,
        quantity1
      ]);

      expect(result1).toHaveLength(4);
    });
  });
  describe('ordering', () => {
    it('should order by createdAt', () => {
      const order1 = 'asc';
      const result1 = applyFilters(data, [null, null, null, null, order1]);
      for (let i = 1, j = result1.length; i < j; i++) {
        expect(result1[i].createdAt).toBeLessThan(result1[i - 1].createdAt);
      }

      const order2 = 'desc';
      const result2 = applyFilters(data, [null, null, null, null, order2]);
      for (let i = 1, j = result2.length; i < j; i++) {
        expect(result2[i].createdAt).toBeGreaterThan(result2[i - 1].createdAt);
      }
    });
    it('should order by price', () => {
      const priceMin1 = '0';
      const priceMax1 = '5000';

      const result1 = applyFilters(data, [null, null, priceMin1, priceMax1]);
      for (let i = 1, j = result1.length; i < j; i++) {
        expect(result1[i].price).toBeLessThan(result1[i - 1].price as number);
      }
    });
    it('should order by rating', () => {
      const rating1 = '2';

      const result1 = applyFilters(data, [
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

const data = [
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
