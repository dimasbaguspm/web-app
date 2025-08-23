import {
  HI_BASE_URL,
  LOGIN_BASE_URL,
  SPENICLE_BASE_URL,
} from '@dimasbaguspm/constants';

export const BASE_URL = {
  HI: HI_BASE_URL,
  SPENICLE: SPENICLE_BASE_URL,
  LOGIN: LOGIN_BASE_URL,
};

export type BaseUrl = keyof typeof BASE_URL;
