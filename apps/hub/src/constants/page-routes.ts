import { BoltIcon, Layers3Icon, ShieldHalfIcon, Users2Icon } from 'lucide-react';

export const ROUTES = {
  MARKETPLACE: '/marketplace',
  GROUPS: '/groups',
  SETTINGS: '/settings',
  ADMINS: '/admins',
} as const;

export const DEEP_LINKS = {
  MARKETPLACE: {
    path: ROUTES.MARKETPLACE,
    title: 'Marketplace',
    icon: Layers3Icon,
  },
  GROUPS: {
    path: ROUTES.GROUPS,
    title: 'Groups',
    icon: Users2Icon,
  },
  SETTINGS: {
    path: ROUTES.SETTINGS,
    title: 'Settings',
    icon: BoltIcon,
  },
  ADMINS: {
    path: ROUTES.ADMINS,
    title: 'Admins',
    icon: ShieldHalfIcon,
  },
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type DeepLinkKeys = keyof typeof DEEP_LINKS;
