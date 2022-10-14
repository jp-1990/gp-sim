export const LOGIN_URL = '/login';
export const LOGOUT_URL = '/logout';

export const LIVERIES_URL = '/liveries';
export const LIVERY_URL = (id: string | number) => `/liveries/${id}`;
export const LIVERY_CREATE_URL = '/liveries/create';

export const GARAGES_URL = '/garages';
export const GARAGE_URL = (id: string | number) => `/garages/${id}`;
export const GARAGE_UPDATE_URL = (id: string | number) =>
  `/garages/update/${id}`;
export const GARAGE_CREATE_URL = '/garages/create';

export const PROFILE_URL = '/profile';
export const PROFILE_URL_BY_ID = (id: string | number) => `/profile/${id}`;
