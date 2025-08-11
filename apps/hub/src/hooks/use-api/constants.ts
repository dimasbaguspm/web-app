export const HI_BASE_URL = 'https://hi.dimasbaguspm.com';
export const SPENICLE_BASE_URL = 'https://spenicle.dimasbaguspm.com';
export const LOGIN_BASE_URL = 'https://login.dimasbaguspm.com';

export const BASE_URL = {
  HI: HI_BASE_URL,
  SPENICLE: SPENICLE_BASE_URL,
  LOGIN: LOGIN_BASE_URL,
};

export type BaseUrl = keyof typeof BASE_URL;
