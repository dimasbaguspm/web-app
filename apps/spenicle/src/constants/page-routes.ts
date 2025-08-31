import { FileText, CreditCard, Tag, PieChart, ChartBarBigIcon, ChartNoAxesCombinedIcon } from 'lucide-react';

export const ROUTES = {
  TRANSACTIONS: '/',
  TRANSACTIONS_ALT: '/transactions',
  TRANSACTIONS_DATE: ':year/:month/:day',
  ACCOUNTS: '/accounts',
  CATEGORIES: '/categories',
  SUMMARY: '/summary',
  SUMMARY_TIMELINE: 'timeline',
  SUMMARY_TRENDS: 'trends',
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
  TRANSACTIONS_DATE: {
    path: (year: number, month: number, day: number) => `/transactions/${year}/${month}/${day}`,
    title: 'Transactions by Date',
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
  SUMMARY_TRENDS: {
    path: '/summary/trends',
    title: 'Trends',
    icon: ChartNoAxesCombinedIcon,
  },
  SUMMARY_TIMELINE: {
    path: '/summary/timeline',
    title: 'Timeline',
    icon: ChartBarBigIcon,
  },
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type DeepLinkKeys = keyof typeof DEEP_LINKS;
