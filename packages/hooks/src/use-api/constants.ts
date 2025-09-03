import { HI_BASE_URL, LOGIN_BASE_URL, SPENICLE_BASE_URL } from '@dimasbaguspm/constants';

export const BASE_URL = {
  HI: HI_BASE_URL,
  SPENICLE: SPENICLE_BASE_URL,
  LOGIN: LOGIN_BASE_URL,
};

export const BASE_QUERY_KEYS = {
  HI_USERS: ['hi', 'users'],
  HI_APPS: ['hi', 'apps'],
  HI_APP_PROFILES: ['hi', 'app-profiles'],
  HI_GROUPS: ['hi', 'groups'],
  HI_GROUP_MEMBERS: ['hi', 'group-members'],
  SPENICLE_ACCOUNTS: ['spenicle', 'accounts'],
  SPENICLE_ACCOUNT_GROUPS: ['spenicle', 'account-groups'],
  SPENICLE_CATEGORIES: ['spenicle', 'categories'],
  SPENICLE_CATEGORY_GROUPS: ['spenicle', 'category-groups'],
  SPENICLE_TRANSACTIONS: ['spenicle', 'transactions'],
  SPENICLE_SUMMARY: ['spenicle', 'summary'],
};

export type BaseUrl = keyof typeof BASE_URL;
