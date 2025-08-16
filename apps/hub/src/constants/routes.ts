export const ROUTES = {
  DASHBOARD: '/',
  MARKETPLACE: '/marketplace',
  PROFILE: '/profile',
  GROUPS: '/groups',
} as const;

export const DEEP_LINKS = {
  DASHBOARD: {
    path: ROUTES.DASHBOARD,
    title: 'Dashboard',
  },
  MARKETPLACE: {
    path: ROUTES.MARKETPLACE,
    title: 'Marketplace',
  },
  PROFILE: {
    path: ROUTES.PROFILE,
    title: 'Profile',
  },
  GROUPS: {
    path: ROUTES.GROUPS,
    title: 'Groups',
  },
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type DeepLinkKeys = keyof typeof DEEP_LINKS;
