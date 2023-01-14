export const LOGIN_URL = '/login';
export const LOGOUT_URL = '/logout';
export const SIGNUP_URL = '/signup';
export const RESET_PASSWORD = '/reset-password';

export const LIVERIES_URL = '/liveries';
export const LIVERY_URL = (id: string) => `/liveries/${id}`;
export const LIVERY_CREATE_URL = '/liveries/create';
export const LIVERY_UPDATE_URL = (id: string) => `/liveries/update/${id}`;

export const GARAGES_URL = '/garages';
export const GARAGES_URL_ID = '/garages/id';
export const GARAGE_URL = (id: string) => `/garages/${id}`;
export const GARAGE_UPDATE_URL = (id: string) => `/garages/update/${id}`;
export const GARAGE_CREATE_URL = '/garages/create';

export const PROFILE_URL = '/profile';
export const PROFILE_URL_ID = '/profile/id';
export const PROFILE_URL_BY_ID = (id: string) => `/profile/${id}`;
