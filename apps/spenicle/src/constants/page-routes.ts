import {
  ListCollapseIcon,
  ChartNoAxesCombinedIcon,
  CogIcon,
  TagsIcon,
  WalletCardsIcon,
  CalendarSyncIcon,
  CalendarRangeIcon,
  DatabaseZapIcon,
  HomeIcon,
  ChartColumnIcon,
} from 'lucide-react';

export const ROUTES = {
  DASHBOARD: '/',
  TRANSACTIONS_ALT: '/transactions',
  TRANSACTIONS_DATE: ':year/:month/:day',
  ACCOUNTS: '/accounts',
  CATEGORIES: '/categories',
  SUMMARY: '/summary',
  SUMMARY_BREAKDOWN: 'breakdown',
  SETTINGS: '/settings',
  SETTINGS_ACCOUNT_GROUPS: '/settings/account-groups',
  SETTINGS_CATEGORY_GROUPS: '/settings/category-groups',
  SETTINGS_SCHEDULED_PAYMENTS: '/settings/scheduled-payments',
  SETTINGS_SCHEDULED_PAYMENTS_RECURRING: '/settings/scheduled-payments/recurring',
  SETTINGS_BACKUP: '/settings/backup',
  SETTINGS_REPORTS_DAILY_OVERVIEW: '/settings/reports/daily-overview',
} as const;

/**
 * Page handles to distinguish between drawer and page routes
 */
export const PAGE_HANDLES = {
  DRAWER: 'drawer',
  PAGE: 'page',
} as const;

export const DEEP_LINKS = {
  DASHBOARD: {
    path: '/',
    title: 'Dashboard',
    icon: HomeIcon,
  },
  TRANSACTIONS_ALT: {
    path: '/transactions',
    title: 'Transactions',
    icon: ListCollapseIcon,
  },
  TRANSACTIONS_DATE: {
    path: (year: number, month: number, day: number) => `/transactions/${year}/${month}/${day}`,
    title: 'Transactions by Date',
    icon: ListCollapseIcon,
  },
  ACCOUNTS: {
    path: '/accounts',
    title: 'Accounts',
    icon: WalletCardsIcon,
  },
  CATEGORIES: {
    path: '/categories',
    title: 'Categories',
    icon: TagsIcon,
  },
  SUMMARY: {
    path: '/summary',
    title: 'Summary',
    icon: ChartColumnIcon,
  },
  SUMMARY_BREAKDOWN: {
    path: '/summary/breakdown',
    title: 'Breakdown',
    icon: ChartNoAxesCombinedIcon,
  },
  SETTINGS: {
    path: '/settings',
    title: 'Settings',
    icon: CogIcon,
  },
  SETTINGS_ACCOUNT_GROUPS: {
    path: '/settings/account-groups',
    title: 'Account Groups',
    icon: WalletCardsIcon,
  },
  SETTINGS_CATEGORY_GROUPS: {
    path: '/settings/category-groups',
    title: 'Category Groups',
    icon: TagsIcon,
  },
  SETTINGS_SCHEDULED_PAYMENTS: {
    path: '/settings/scheduled-payments',
    title: 'Scheduled Payments',
    icon: CalendarRangeIcon,
  },
  SETTINGS_SCHEDULED_PAYMENTS_RECURRING: {
    path: '/settings/scheduled-payments/recurring',
    title: 'Recurring Payments',
    icon: CalendarSyncIcon,
  },
  SETTINGS_BACKUP: {
    path: '/settings/backup',
    title: 'Backup',
    icon: DatabaseZapIcon,
  },
  SETTINGS_REPORTS_DAILY_OVERVIEW: {
    path: '/settings/reports/daily-overview',
    title: 'Daily Overview',
    icon: ListCollapseIcon,
  },
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type DeepLinkKeys = keyof typeof DEEP_LINKS;
