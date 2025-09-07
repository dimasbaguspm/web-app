import { DEEP_LINKS } from '../../constants/page-routes';

export const settingsGroups = [
  {
    title: 'General',
    description: 'Organize your financial data with custom groups',
    items: [
      {
        id: 'account-groups',
        title: 'Account Groups',
        description: 'Create and manage groups for your accounts to better organize your finances',
        icon: DEEP_LINKS.SETTINGS_ACCOUNT_GROUPS.icon,
        path: DEEP_LINKS.SETTINGS_ACCOUNT_GROUPS.path,
        badge: 'Popular',
      },
      {
        id: 'category-groups',
        title: 'Category Groups',
        description: 'Organize expense and income categories into logical groups for better tracking',
        icon: DEEP_LINKS.SETTINGS_CATEGORY_GROUPS.icon,
        path: DEEP_LINKS.SETTINGS_CATEGORY_GROUPS.path,
        badge: null,
      },
      {
        id: 'backup-and-restore',
        title: 'Backup & Restore',
        description: 'Create backups of your data to prevent loss and restore when needed',
        icon: DEEP_LINKS.SETTINGS_BACKUP.icon,
        path: DEEP_LINKS.SETTINGS_BACKUP.path,
        badge: null,
      },
    ],
  },
  {
    title: 'Scheduled Payments',
    description: 'Automate and manage recurring transactions',
    items: [
      {
        id: 'installments',
        title: 'Installments',
        description: 'Set up and track installment payments for your purchases',
        icon: DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS.icon,
        path: DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS.path,
        badge: 'New',
      },
      {
        id: 'recurring-payments',
        title: 'Recurring Payments',
        description: 'Automate your regular payments to stay on top of your finances',
        icon: DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS_RECURRING.icon,
        path: DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS_RECURRING.path,
        badge: 'New',
      },
    ],
  },
];
