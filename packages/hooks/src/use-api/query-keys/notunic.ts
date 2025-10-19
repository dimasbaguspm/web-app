import { BASE_QUERY_KEYS } from '../constants';

export const NOTUNIC_QUERY_KEYS = {
  NOTUNIC_SPACES_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_SPACES,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_SPACES_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_SPACES,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_SPACES_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_SPACES,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_THREADS_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_THREADS,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_THREADS_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_THREADS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_THREADS_BY_ID: (id: number, params = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_THREADS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_THREADS_BY_ID_SUMMARY: (id: number, params = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_THREADS,
    'by-id',
    id,
    'summary',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_THREAD_GROUPS_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_THREAD_GROUPS,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_THREAD_GROUPS_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_THREAD_GROUPS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_THREAD_GROUPS_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_THREAD_GROUPS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_THREAD_CATEGORIES_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_THREAD_CATEGORIES_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_THREAD_CATEGORIES_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_THREAD_CATEGORIES,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_THREAD_CATEGORY_MEMBERS_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_THREAD_CATEGORY_MEMBERS,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_THREAD_CATEGORY_MEMBERS_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_THREAD_CATEGORY_MEMBERS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_THREAD_CATEGORY_MEMBERS_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_THREAD_CATEGORY_MEMBERS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_COMMENTS_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_COMMENTS,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_COMMENTS_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_COMMENTS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_COMMENTS_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_COMMENTS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_COMMENT_ACTIONS_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_COMMENT_ACTIONS,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_COMMENT_ACTIONS_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_COMMENT_ACTIONS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_COMMENT_ACTIONS_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_COMMENT_ACTIONS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_COMMENT_CATEGORIES_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_COMMENT_CATEGORIES,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_COMMENT_CATEGORIES_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_COMMENT_CATEGORIES,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_COMMENT_CATEGORIES_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_COMMENT_CATEGORIES,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_COMMENT_CATEGORY_MEMBERS_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_COMMENT_CATEGORY_MEMBERS,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_COMMENT_CATEGORY_MEMBERS_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_COMMENT_CATEGORY_MEMBERS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  NOTUNIC_COMMENT_CATEGORY_MEMBERS_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.NOTUNIC_COMMENT_CATEGORY_MEMBERS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
};
