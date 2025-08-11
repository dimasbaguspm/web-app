export const HI_URL = {
  AUTH: {
    ME: '/auth/me',
  },
  USER: {
    PAGINATED: '/user',
    BY_ID: (id: number) => `/user/${id}`,
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
