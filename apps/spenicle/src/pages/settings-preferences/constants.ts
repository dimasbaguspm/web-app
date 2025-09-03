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
    ],
  },
  {
    title: 'Scheduled Payments',
    description: 'Automate and manage recurring transactions',
    items: [
      {
        id: 'scheduled-payments',
        title: 'Manage Scheduled Payments',
        description: 'Set up recurring payments and automate your regular financial transactions',
        icon: DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS.icon,
        path: DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS.path,
        badge: 'New',
      },
    ],
  },
];
