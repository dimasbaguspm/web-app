import {
  FileText,
  PieChart,
  ChartBarBigIcon,
  ChartNoAxesCombinedIcon,
  CogIcon,
  TagsIcon,
  WalletCardsIcon,
  CalendarSyncIcon,
  CalendarRangeIcon,
  FolderOutputIcon,
  FolderInputIcon,
} from 'lucide-react';

export const ROUTES = {
  TRANSACTIONS: '/',
  TRANSACTIONS_ALT: '/transactions',
  TRANSACTIONS_DATE: ':year/:month/:day',
  ACCOUNTS: '/accounts',
  CATEGORIES: '/categories',
  SUMMARY: '/summary',
  SUMMARY_TIMELINE: 'timeline',
  SUMMARY_TRENDS: 'trends',
  SETTINGS: '/settings',
  SETTINGS_ACCOUNT_GROUPS: '/settings/account-groups',
  SETTINGS_CATEGORY_GROUPS: '/settings/category-groups',
  SETTINGS_SCHEDULED_PAYMENTS: '/settings/scheduled-payments',
  SETTINGS_SCHEDULED_PAYMENTS_RECURRING: '/settings/scheduled-payments/recurring',
  SETTINGS_BACKUP: '/settings/backup',
  SETTINGS_BACKUP_RESTORE: '/settings/backup/restore',
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
    icon: FolderOutputIcon,
  },
  SETTINGS_BACKUP_RESTORE: {
    path: '/settings/backup/restore',
    title: 'Restore Backup',
    icon: FolderInputIcon,
  },
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type DeepLinkKeys = keyof typeof DEEP_LINKS;
