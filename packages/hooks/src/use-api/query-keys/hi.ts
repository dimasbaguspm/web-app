import { BASE_QUERY_KEYS } from '../constants';

export const HI_QUERY_KEYS = {
  HI_AUTH_ME: ['hi', 'auth', 'me'],
  HI_AUTH_TOKEN: ['hi', 'auth', 'token'],
  HI_USER_INFINITE: (params: object = {}) => [...BASE_QUERY_KEYS.HI_USERS, 'infinite', JSON.stringify(params ?? {})],
  HI_USER_PAGINATED: (params: object = {}) => [...BASE_QUERY_KEYS.HI_USERS, 'paginated', JSON.stringify(params ?? {})],
  HI_USER_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.HI_USERS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  HI_USER_ME: ['hi', 'user', 'me'],
  HI_APPS_INFINITE: (params: object = {}) => [...BASE_QUERY_KEYS.HI_APPS, 'infinite', JSON.stringify(params ?? {})],
  HI_APPS_PAGINATED: (params: object = {}) => [...BASE_QUERY_KEYS.HI_APPS, 'paginated', JSON.stringify(params ?? {})],
  HI_APPS_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.HI_APPS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  HI_APP_PROFILES_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.HI_APP_PROFILES,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  HI_APP_PROFILES_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.HI_APP_PROFILES,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  HI_APP_PROFILES_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.HI_APP_PROFILES,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  HI_APP_PROFILES_AUTH: (params: object = {}) => [
    ...BASE_QUERY_KEYS.HI_APP_PROFILES,
    'auth',
    JSON.stringify(params ?? {}),
  ],

  HI_GROUPS_INFINITE: (params: object = {}) => [...BASE_QUERY_KEYS.HI_GROUPS, 'infinite', JSON.stringify(params ?? {})],
  HI_GROUPS_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.HI_GROUPS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  HI_GROUPS_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.HI_GROUPS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  HI_GROUP_MEMBERS_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.HI_GROUP_MEMBERS,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  HI_GROUP_MEMBERS_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.HI_GROUP_MEMBERS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  HI_GROUP_MEMBERS_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.HI_GROUP_MEMBERS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
};
