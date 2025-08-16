export const HI_URL = {
  AUTH: {
    ME: '/auth/me',
  },
  USER: {
    PAGINATED: '/user',
    BY_ID: (id: number) => `/user/${id}`,
  },
  APPS: {
    PAGINATED: '/apps',
  },
  GROUPS: {
    PAGINATED: '/groups',
    BY_ID: (id: number) => `/groups/${id}`,
  },
  GROUP_MEMBERS: {
    PAGINATED: '/group-members',
    BY_ID: (id: number) => `/group-members/${id}`,
  },
  GROUP_APPS: {
    PAGINATED: '/group-apps',
    BY_ID: (id: number) => `/group-apps/${id}`,
  },
};

export const SPENICLE_URL = {
  ACCOUNT: {
    PAGINATED: '/account',
    BY_ID: (id: number) => `/account/${id}`,
  },
  CATEGORY: {
    PAGINATED: '/category',
    BY_ID: (id: number) => `/category/${id}`,
  },
  TRANSACTION: {
    PAGINATED: '/transaction',
    BY_ID: (id: number) => `/transaction/${id}`,
  },
  SUMMARY: '/summary',
};
