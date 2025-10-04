export const HI_URL = {
  AUTH: {
    ME: '/auth/me',
    SET_ACTIVE_PROFILE: '/auth/set-active-profile',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USER: {
    PAGINATED: '/user',
    ME: '/user/me',
  },
  APPS: {
    PAGINATED: '/apps',
    BY_ID: (id: number) => `/apps/${id}`,
  },
  GROUPS: {
    PAGINATED: '/groups',
    BY_ID: (id: number) => `/groups/${id}`,
  },
  GROUP_MEMBERS: {
    PAGINATED: '/group-members',
    BY_ID: (id: number) => `/group-members/${id}`,
  },
  APP_PROFILES: {
    PAGINATED: '/app-profiles',
    BY_ID: (id: number) => `/app-profiles/${id}`,
  },
  APP_PROFILES_AUTH: {
    UPSERT_BYID: `/app-profiles-auth/:id`,
    UPSERT: '/app-profiles-auth',
    VERIFY_PIN: '/app-profiles-auth/verify-pin',
  },
};

export const SPENICLE_URL = {
  ACCOUNT: {
    PAGINATED: '/account',
    BY_ID: (id: number) => `/account/${id}`,
  },
  ACCOUNT_GROUP: {
    PAGINATED: '/account-group',
    BY_ID: (id: number) => `/account-group/${id}`,
  },
  ACCOUNT_GROUP_MEMBERS: {
    PAGINATED: '/account-group-members',
    BY_ID: (id: number) => `/account-group-members/${id}`,
  },
  BACKUP_REQUESTS: {
    PAGINATED: '/backup-requests',
    BY_ID: (id: number) => `/backup-requests/${id}`,
  },
  CATEGORY: {
    PAGINATED: '/category',
    BY_ID: (id: number) => `/category/${id}`,
  },
  CATEGORY_GROUP: {
    PAGINATED: '/category-group',
    BY_ID: (id: number) => `/category-group/${id}`,
  },
  CATEGORY_GROUP_MEMBERS: {
    PAGINATED: '/category-group-members',
    BY_ID: (id: number) => `/category-group-members/${id}`,
  },
  TRANSACTION: {
    PAGINATED: '/transaction',
    BY_ID: (id: number) => `/transaction/${id}`,
  },
  SCHEDULED_TRANSACTION: {
    PAGINATED: '/scheduled-transaction',
    BY_ID: (id: number) => `/scheduled-transaction/${id}`,
  },
  SUMMARY: {
    TRANSACTIONS: '/summary/transactions',
    ACCOUNTS: '/summary/account',
    CATEGORIES: '/summary/category',
    TOTAL: '/summary/total',
  },
};

export const NOTUNIC_URL = {
  SPACES: {
    PAGINATED: '/spaces',
    BY_ID: (id: number) => `/spaces/${id}`,
  },
  THREADS: {
    PAGINATED: '/threads',
    BY_ID: (id: number) => `/threads/${id}`,
  },
  THREAD_CATEGORIES: {
    PAGINATED: '/thread-category',
    BY_ID: (id: number) => `/thread-category/${id}`,
  },
  THREAD_CATEGORY_MEMBERS: {
    PAGINATED: '/thread-category-members',
    BY_ID: (id: number) => `/thread-category-members/${id}`,
  },
  THREAD_GROUPS: {
    PAGINATED: '/thread-group',
    BY_ID: (id: number) => `/thread-group/${id}`,
  },
  THREAD_GROUP_TAGS: {
    PAGINATED: '/thread-group-tag',
    BY_ID: (id: number) => `/thread-group-tag/${id}`,
  },
  COMMENTS: {
    PAGINATED: '/comments',
    BY_ID: (id: number) => `/comments/${id}`,
  },
  COMMENT_ACTIONS: {
    PAGINATED: '/comment-actions',
    BY_ID: (id: number) => `/comment-actions/${id}`,
  },
  COMMENT_CATEGORIES: {
    PAGINATED: '/comment-category',
    BY_ID: (id: number) => `/comment-category/${id}`,
  },
  COMMENT_CATEGORY_MEMBERS: {
    PAGINATED: '/comment-category-members',
    BY_ID: (id: number) => `/comment-category-members/${id}`,
  },
};
