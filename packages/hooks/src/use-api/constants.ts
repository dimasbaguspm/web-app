import { HI_BASE_URL, LOGIN_BASE_URL, NOTUNIC_BASE_URL, SPENICLE_BASE_URL } from '@dimasbaguspm/constants';

export const BASE_URL = {
  HI: HI_BASE_URL,
  SPENICLE: SPENICLE_BASE_URL,
  NOTUNIC: NOTUNIC_BASE_URL,
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
  SPENICLE_ACCOUNT_GROUP_MEMBERS: ['spenicle', 'account-group-members'],
  SPENICLE_BACKUP_REQUESTS: ['spenicle', 'backup-requests'],
  SPENICLE_CATEGORIES: ['spenicle', 'categories'],
  SPENICLE_CATEGORY_GROUPS: ['spenicle', 'category-groups'],
  SPENICLE_CATEGORY_GROUP_MEMBERS: ['spenicle', 'category-group-members'],
  SPENICLE_TRANSACTIONS: ['spenicle', 'transactions'],
  SPENICLE_SCHEDULED_TRANSACTIONS: ['spenicle', 'scheduled-transactions'],
  SPENICLE_SUMMARY: ['spenicle', 'summary'],

  NOTUNIC_SPACES: ['notunic', 'spaces'],
  NOTUNIC_THREADS: ['notunic', 'threads'],
  NOTUNIC_THREAD_CATEGORIES: ['notunic', 'thread-categories'],
  NOTUNIC_THREAD_CATEGORY_MEMBERS: ['notunic', 'thread-category-members'],
  NOTUNIC_THREAD_GROUPS: ['notunic', 'thread-groups'],
  NOTUNIC_COMMENTS: ['notunic', 'comments'],
  NOTUNIC_COMMENT_ACTIONS: ['notunic', 'comment-actions'],
  NOTUNIC_COMMENT_CATEGORIES: ['notunic', 'comment-categories'],
  NOTUNIC_COMMENT_CATEGORY_MEMBERS: ['notunic', 'comment-category-members'],
  NOTUNIC_ACTIONS: ['notunic', 'actions'],
  NOTUNIC_ACTION_LINKS: ['notunic', 'action-links'],
};

export type BaseUrl = keyof typeof BASE_URL;
