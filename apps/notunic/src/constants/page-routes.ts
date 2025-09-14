import { GalleryVerticalEndIcon, KanbanSquareIcon } from 'lucide-react';

export const ROUTES = {
  SPACES: '/',
  MY_ACTIONS: '/my-actions',
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
  MY_ACTIONS: {
    path: ROUTES.MY_ACTIONS,
    title: 'My Actions',
    icon: KanbanSquareIcon,
  },
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type DeepLinkKeys = keyof typeof DEEP_LINKS;
