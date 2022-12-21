import fs from 'fs';
import React, { useMemo } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { ChakraProvider } from '@chakra-ui/react';
import { configureStore, Store } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { storeConfig } from '../../store/store';
import theme from '../../styles/chakra-theme';

import English from '../../../lang/en.json';
import French from '../../../lang/fr.json';

import { CarDataType, CarsDataType, UserDataType } from '../../types';

interface MockCurrentUserState {
  token: string | null;
  data: UserDataType | null;
  status: string;
}

const defaultCurrentUserState: MockCurrentUserState = {
  token: 'some-mock-token',
  status: 'fulfilled',
  data: {
    id: '0',
    createdAt: 1651734649483,
    updatedAt: 1651734649483,
    lastLogin: 1651734649484,
    forename: 'Julius',
    surname: 'Little',
    displayName: 'Julius Little',
    email: 'julius.little@gmail.com',
    about:
      'Hi, I am Julius Little, and this is my profile! <br/> <br/>\n              Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n              Mauris mauris eros, euismod ut mi vitae, convallis iaculis\n              quam. Pellentesque consectetur iaculis tortor vitae euismod.\n              Integer malesuada congue elementum. Pellentesque vulputate\n              diam dignissim elit hendrerit iaculis.',
    image: '/car2.png',
    garages: [
      '431d885d-4041-4518-bc92-60e69a5d5a94',
      '9a8fbcae-06ff-428b-9008-548bae2cd134',
      'fdceaf93-597e-4452-83dc-a2326037b0ca',
      'be9c553b-e767-4463-b3d2-5571e89b33dd',
      '61034479-6d77-492f-bf5c-d8812b27471e',
      '6285e1a1-08c3-4982-be2b-06db7a2226d4',
      '7e7f00a5-4ca2-4bb7-885e-e33bb27c404e',
      '10fe7a00-bae2-4579-9f6e-698b906f6057',
      '6ce8c60e-57fb-4f5b-9bf6-7ddd69696756',
      'd7d206d0-609c-4fce-b499-ba62a8c4772e',
      '2d2e08d9-643b-4bc6-8da7-fc28c151e1f8',
      'ad348f42-c6a9-4cd2-a635-c9ed5f40ba01',
      'ec08072f-156c-46a9-9691-c263e9d8e5b6',
      '055531b5-e1ef-408c-bfb4-9ec5353812cd',
      '8d75e2dc-ad75-4bbe-9106-5b6b20be9973',
      '44702405-8231-43ec-9409-b28994c74fad',
      '995feaaa-06d5-40a5-85dc-45e052979e42',
      '450721a5-4892-4a89-be0d-8a153864ac7d',
      'c78144b7-3bd8-4fab-bc04-e887748f389d',
      '37517afc-70c4-416d-8f10-3473938e9221'
    ],
    liveries: [
      'd03bfb4f-3b88-41ec-92bb-14b3438696ec',
      '46b7b672-2ce1-47b2-a0ce-a66acad40ae2',
      'b936f9e3-95aa-4562-8066-f7ca29717602',
      'e129b18d-e008-495d-9fd4-346eb18e60e5',
      'd63cf4fd-9d7a-4d54-9eec-b583ef69c08d',
      '91b41272-0b4e-401b-9f11-f4d101ebf320',
      '7657534b-80c2-430d-a808-d40c03fd6cbe',
      '29c904a1-8d87-4ac0-b0f4-791554dabcdd',
      'b36bb559-9ea8-44e7-b263-5be5d234bf9f'
    ]
  }
};

export const setMockCurrentUser = (mockCurrentUser: MockCurrentUserState) => {
  defaultCurrentUserState.token = mockCurrentUser.token;
  defaultCurrentUserState.status = mockCurrentUser.status;
  defaultCurrentUserState.data = mockCurrentUser.data;
};

const carData = fs.readFileSync('src/utils/dev-data/cars.json', 'utf-8');
const cars = JSON.parse(carData) as CarsDataType;

const defaultPreloadedState = {
  userSlice: {
    currentUser: defaultCurrentUserState,
    users: {
      ids: ['0'],
      entities: {
        '0': {
          id: '0',
          createdAt: 1651734649483,
          updatedAt: 1651734649483,
          lastLogin: 1651734649484,
          forename: 'Julius',
          surname: 'Little',
          displayName: 'Julius Little',
          email: 'julius.little@gmail.com',
          about:
            'Hi, I am Julius Little, and this is my profile! <br/> <br/>\n              Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n              Mauris mauris eros, euismod ut mi vitae, convallis iaculis\n              quam. Pellentesque consectetur iaculis tortor vitae euismod.\n              Integer malesuada congue elementum. Pellentesque vulputate\n              diam dignissim elit hendrerit iaculis.',
          image: '/car2.png',
          garages: [
            '431d885d-4041-4518-bc92-60e69a5d5a94',
            '9a8fbcae-06ff-428b-9008-548bae2cd134',
            'fdceaf93-597e-4452-83dc-a2326037b0ca',
            'be9c553b-e767-4463-b3d2-5571e89b33dd',
            '61034479-6d77-492f-bf5c-d8812b27471e',
            '6285e1a1-08c3-4982-be2b-06db7a2226d4',
            '7e7f00a5-4ca2-4bb7-885e-e33bb27c404e',
            '10fe7a00-bae2-4579-9f6e-698b906f6057',
            '6ce8c60e-57fb-4f5b-9bf6-7ddd69696756',
            'd7d206d0-609c-4fce-b499-ba62a8c4772e',
            '2d2e08d9-643b-4bc6-8da7-fc28c151e1f8',
            'ad348f42-c6a9-4cd2-a635-c9ed5f40ba01',
            'ec08072f-156c-46a9-9691-c263e9d8e5b6',
            '055531b5-e1ef-408c-bfb4-9ec5353812cd',
            '8d75e2dc-ad75-4bbe-9106-5b6b20be9973',
            '44702405-8231-43ec-9409-b28994c74fad',
            '995feaaa-06d5-40a5-85dc-45e052979e42',
            '450721a5-4892-4a89-be0d-8a153864ac7d',
            'c78144b7-3bd8-4fab-bc04-e887748f389d',
            '37517afc-70c4-416d-8f10-3473938e9221'
          ],
          liveries: [
            'd03bfb4f-3b88-41ec-92bb-14b3438696ec',
            '46b7b672-2ce1-47b2-a0ce-a66acad40ae2',
            'b936f9e3-95aa-4562-8066-f7ca29717602',
            'e129b18d-e008-495d-9fd4-346eb18e60e5',
            'd63cf4fd-9d7a-4d54-9eec-b583ef69c08d',
            '91b41272-0b4e-401b-9f11-f4d101ebf320',
            '7657534b-80c2-430d-a808-d40c03fd6cbe',
            '29c904a1-8d87-4ac0-b0f4-791554dabcdd',
            'b36bb559-9ea8-44e7-b263-5be5d234bf9f'
          ]
        }
      },
      status: 'idle',
      error: null as string | null
    }
  },
  carSlice: {
    ...cars.reduce(
      (acc, curr, i) => {
        const prev = { ...acc };
        prev.ids.push(`${i}`);
        prev.entities[`${i}`] = curr;
        return prev;
      },
      { ids: [], entities: {} } as {
        ids: string[];
        entities: Record<string, CarDataType>;
      }
    ),
    status: 'fulfilled',
    error: null
  },
  garageSlice: {
    ids: ['431d885d-4041-4518-bc92-60e69a5d5a94'],
    entities: {
      '431d885d-4041-4518-bc92-60e69a5d5a94': {
        id: '431d885d-4041-4518-bc92-60e69a5d5a94',
        createdAt: 1651734649484,
        updatedAt: 1651734649484,
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
        ],
        searchHelpers: ['julius', "little's", 'garage']
      }
    },
    status: 'fulfilled',
    error: null
  }
};

interface Props {
  locale?: string;
  preloadedState?: Record<string, any>;
  testStore: Store;
  children: React.ReactNode;
}
const TestProviders: React.FC<Props> = ({
  locale = 'en',
  preloadedState = defaultPreloadedState,
  testStore = configureStore({
    ...storeConfig,
    preloadedState
  }),
  children
}) => {
  const messages = useMemo(() => {
    switch (locale) {
      case 'en':
        return English;
      case 'fr':
        return French;
      default:
        return English;
    }
  }, [locale]);

  return (
    <Provider store={testStore}>
      <ChakraProvider theme={theme}>
        <IntlProvider messages={messages} locale={locale} defaultLocale={'en'}>
          {children}
        </IntlProvider>
      </ChakraProvider>
    </Provider>
  );
};

interface CustomRenderOptions {
  testProviderProps?: Props;
  testingLibraryOptions?: Omit<RenderOptions, 'wrapper'>;
}
export const customRender = (
  ui: React.ReactElement,
  options?: CustomRenderOptions
) => {
  return render(ui, {
    wrapper: (props: any) => (
      <TestProviders {...props} {...options?.testProviderProps} />
    ),
    ...options?.testingLibraryOptions
  });
};

export * from '@testing-library/react';
export { customRender as render };
