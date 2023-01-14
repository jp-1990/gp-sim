export const stateKeys = {
  TITLE: 'title',
  DESCRIPTION: 'description',
  PUBLIC_LIVERY: 'isPublic',
  PRICE: 'price',
  SEARCH_TAGS: 'tags',
  IMAGE_FILES: 'imageFiles'
} as const;

export const initialState = {
  error: false,
  invalidFields: [],
  loading: false,
  [stateKeys.IMAGE_FILES]: [],
  [stateKeys.SEARCH_TAGS]: ''
};

export const validators = {
  title: undefined,
  description: undefined,
  publicLivery: undefined,
  price: undefined,
  searchTags: undefined,
  imageFiles: undefined
};
