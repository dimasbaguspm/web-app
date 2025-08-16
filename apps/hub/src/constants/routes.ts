export const ROUTES = {
  DASHBOARD: '/',
  MARKETPLACE: '/marketplace',
  MARKETPLACE_AVAILABLE: '/marketplace/available',
  MARKETPLACE_INSTALLED: '/marketplace/installed',
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
  MARKETPLACE_AVAILABLE: {
    path: ROUTES.MARKETPLACE_AVAILABLE,
    title: 'Available Apps',
  },
  MARKETPLACE_INSTALLED: {
    path: ROUTES.MARKETPLACE_INSTALLED,
    title: 'Installed Apps',
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
