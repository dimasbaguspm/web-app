export const ROUTES = {
  MARKETPLACE: '/marketplace',
  MARKETPLACE_DETAIL: '/marketplace/:id',
  PROFILES: '/profiles',
  GROUPS: '/groups',
  ACCOUNTS: '/accounts',
} as const;

export const DEEP_LINKS = {
  MARKETPLACE: {
    path: ROUTES.MARKETPLACE,
    title: 'Marketplace',
  },
  MARKETPLACE_DETAIL: (appId: number) => ({
    path: ROUTES.MARKETPLACE_DETAIL.replace(':id', appId.toString()),
    title: 'Marketplace Detail',
  }),
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
