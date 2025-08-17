export const ROUTES = {
  MARKETPLACE: '/',
  PROFILES: '/profiles',
  GROUPS: '/groups',
  ACCOUNTS: '/accounts',
} as const;

export const DEEP_LINKS = {
  MARKETPLACE: {
    path: ROUTES.MARKETPLACE,
    title: 'Marketplace',
  },
  PROFILES: {
    path: ROUTES.PROFILES,
    title: 'Profiles',
  },
  GROUPS: {
    path: ROUTES.GROUPS,
    title: 'Groups',
  },
  ACCOUNTS: {
    path: ROUTES.ACCOUNTS,
    title: 'Accounts',
  },
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type DeepLinkKeys = keyof typeof DEEP_LINKS;
