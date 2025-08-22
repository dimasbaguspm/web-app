import { FileText, CreditCard, Tag, PieChart } from 'lucide-react';

export const ROUTES = {
  TRANSACTIONS: '/',
  TRANSACTIONS_ALT: '/transactions',
  ACCOUNTS: '/accounts',
  CATEGORIES: '/categories',
  SUMMARY: '/summary',
} as const;

export const DEEP_LINKS = {
  TRANSACTIONS: {
    path: '/',
    title: 'Transactions',
    icon: FileText,
  },
  TRANSACTIONS_ALT: {
    path: '/transactions',
    title: 'Transactions',
    icon: FileText,
  },
  ACCOUNTS: {
    path: '/accounts',
    title: 'Accounts',
    icon: CreditCard,
  },
  CATEGORIES: {
    path: '/categories',
    title: 'Categories',
    icon: Tag,
  },
  SUMMARY: {
    path: '/summary',
    title: 'Summary',
    icon: PieChart,
  },
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type DeepLinkKeys = keyof typeof DEEP_LINKS;
