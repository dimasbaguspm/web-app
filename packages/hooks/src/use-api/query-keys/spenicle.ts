import { BASE_QUERY_KEYS } from '../constants';

export const SPENICLE_QUERY_KEYS = {
  SPENICLE_ACCOUNT_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_ACCOUNTS,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_ACCOUNT_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_ACCOUNTS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_ACCOUNT_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_ACCOUNTS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_ACCOUNT_GROUPS_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_ACCOUNT_GROUPS_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_ACCOUNT_GROUPS_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_ACCOUNT_GROUPS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_ACCOUNT_GROUP_MEMBERS_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_ACCOUNT_GROUP_MEMBERS,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_ACCOUNT_GROUP_MEMBERS_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_ACCOUNT_GROUP_MEMBERS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_ACCOUNT_GROUP_MEMBERS_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_ACCOUNT_GROUP_MEMBERS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_BACKUP_REQUESTS_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_BACKUP_REQUESTS,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_BACKUP_REQUESTS_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_BACKUP_REQUESTS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_BACKUP_REQUESTS_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_BACKUP_REQUESTS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_CATEGORY_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_CATEGORIES,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_CATEGORY_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_CATEGORIES,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_CATEGORY_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_CATEGORIES,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_CATEGORY_GROUPS_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_CATEGORY_GROUPS,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_CATEGORY_GROUPS_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_CATEGORY_GROUPS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_CATEGORY_GROUPS_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_CATEGORY_GROUPS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_CATEGORY_GROUP_MEMBERS_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_CATEGORY_GROUP_MEMBERS,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_CATEGORY_GROUP_MEMBERS_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_CATEGORY_GROUP_MEMBERS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_CATEGORY_GROUP_MEMBERS_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_CATEGORY_GROUP_MEMBERS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_TRANSACTION_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_TRANSACTIONS,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_TRANSACTION_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_TRANSACTIONS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_TRANSACTION_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_TRANSACTIONS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_SCHEDULED_TRANSACTION_INFINITE: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_SCHEDULED_TRANSACTIONS,
    'infinite',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_SCHEDULED_TRANSACTION_PAGINATED: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_SCHEDULED_TRANSACTIONS,
    'paginated',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_SCHEDULED_TRANSACTION_BY_ID: (id: number, params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_SCHEDULED_TRANSACTIONS,
    'by-id',
    id,
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_SUMMARY_TRANSACTIONS: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_SUMMARY,
    'transactions',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_SUMMARY_ACCOUNTS: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_SUMMARY,
    'accounts',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_SUMMARY_CATEGORIES: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_SUMMARY,
    'categories',
    JSON.stringify(params ?? {}),
  ],
  SPENICLE_SUMMARY_TOTAL: (params: object = {}) => [
    ...BASE_QUERY_KEYS.SPENICLE_SUMMARY,
    'total',
    JSON.stringify(params ?? {}),
  ],
};
