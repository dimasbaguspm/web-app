export const HI_URL = {
  AUTH: {
    ME: '/auth/me',
    SET_ACTIVE_PROFILE: '/auth/set-active-profile',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USER: {
    PAGINATED: '/user',
    BY_ID: (id: number) => `/user/${id}`,
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
  CATEGORY: {
    PAGINATED: '/category',
    BY_ID: (id: number) => `/category/${id}`,
  },
  CATEGORY_GROUP: {
    PAGINATED: '/category-group',
    BY_ID: (id: number) => `/category-group/${id}`,
  },
  TRANSACTION: {
    PAGINATED: '/transaction',
    BY_ID: (id: number) => `/transaction/${id}`,
  },
  SUMMARY: {
    TRANSACTIONS: '/summary/transactions',
    ACCOUNTS: '/summary/account',
    CATEGORIES: '/summary/category',
    TOTAL: '/summary/total',
  },
};
