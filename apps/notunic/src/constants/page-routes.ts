import { GalleryVerticalEndIcon, KanbanSquareIcon } from 'lucide-react';

export const ROUTES = {
  BOARD: '/',
  SPACE: '/space',
  TODO: '/todo',
} as const;

export const DEEP_LINKS = {
  BOARD: {
    path: '/',
    title: 'Board',
    icon: KanbanSquareIcon,
  },
  SPACE: {
    path: '/space',
    title: 'Space',
    icon: GalleryVerticalEndIcon,
  },
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type DeepLinkKeys = keyof typeof DEEP_LINKS;
