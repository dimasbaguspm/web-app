import { BoltIcon, GalleryVerticalEndIcon } from 'lucide-react';

export const ROUTES = {
  SPACES: '/',
  SPACES_ALT: '/spaces',
  SPACES_DETAIL: '/spaces/:id',
  SPACES_DETAIL_THREADS: 'threads',
  SPACES_DETAIL_ACTIONS: 'actions',
  SETTINGS: '/settings',
  SETTINGS_THREAD_CATEGORIES: 'thread-categories',
} as const;

export const DEEP_LINKS = {
  SPACES: {
    path: '/',
    title: 'Spaces',
    icon: GalleryVerticalEndIcon,
  },
  SPACES_ALT: {
    path: '/spaces',
    title: 'Spaces',
    icon: GalleryVerticalEndIcon,
  },
  SPACES_DETAIL: {
    path: (id: string) => `/spaces/${id}`,
    title: 'Space Detail',
    icon: GalleryVerticalEndIcon,
  },
  SPACES_DETAIL_THREADS: {
    path: (id: string) => `/spaces/${id}/threads`,
    title: 'Space Threads',
    icon: GalleryVerticalEndIcon,
  },
  SPACES_DETAIL_ACTIONS: {
    path: (id: string) => `/spaces/${id}/actions`,
    title: 'Space Actions',
    icon: GalleryVerticalEndIcon,
  },
  SETTINGS: {
    path: ROUTES.SETTINGS,
    title: 'Settings',
    icon: BoltIcon,
  },
  SETTINGS_THREAD_CATEGORIES: {
    path: ROUTES.SETTINGS_THREAD_CATEGORIES,
    title: 'Thread Categories',
    icon: BoltIcon,
  },
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type DeepLinkKeys = keyof typeof DEEP_LINKS;
