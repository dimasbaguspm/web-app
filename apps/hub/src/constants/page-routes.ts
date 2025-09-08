import { AxeIcon, BoltIcon } from 'lucide-react';

export const ROUTES = {
  MARKETPLACE: '/marketplace',
  MARKETPLACE_DETAIL: '/marketplace/:id',
  GROUPS: '/groups',
  SETTINGS: '/settings',
} as const;

export const DEEP_LINKS = {
  MARKETPLACE: {
    path: ROUTES.MARKETPLACE,
    title: 'Marketplace',
    icon: AxeIcon,
  },
  MARKETPLACE_DETAIL: (appId: number) => ({
    path: ROUTES.MARKETPLACE_DETAIL.replace(':id', appId.toString()),
    title: 'Marketplace Detail',
    icon: AxeIcon,
  }),
  GROUPS: {
    path: ROUTES.GROUPS,
    title: 'Groups',
    icon: AxeIcon,
  },
  SETTINGS: {
    path: ROUTES.SETTINGS,
    title: 'Settings',
    icon: BoltIcon,
  },
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type DeepLinkKeys = keyof typeof DEEP_LINKS;
