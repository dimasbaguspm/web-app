export const ROUTES = {
  DASHBOARD: '/',
  MARKETPLACE: '/marketplace',
  PROFILE: '/profile',
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
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type DeepLinkKeys = keyof typeof DEEP_LINKS;
