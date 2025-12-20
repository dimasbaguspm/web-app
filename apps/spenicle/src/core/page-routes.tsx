/* eslint-disable import/max-dependencies */
import { ProfileAuthGuard } from '@dimasbaguspm/providers/active-app-profile-provider';
import { BottomSheetRouteProvider } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { DrawerRouteProvider } from '@dimasbaguspm/providers/drawer-route-provider';
import { ModalRouteProvider } from '@dimasbaguspm/providers/modal-route-provider';
import { lazyLoad } from '@dimasbaguspm/utils/lazy-load';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';

import { DRAWER_ROUTES } from '../constants/drawer-routes';
import { DEEP_LINKS, PAGE_HANDLES, ROUTES } from '../constants/page-routes';
import SummaryLayout from '../pages/summary/page';

import { Layout } from './app-layout';
import { BottomSheetRoutes } from './bottom-sheet-routes';
import { DrawerRoutes } from './drawer-routes';
import { FloatingActionsButton } from './floating-actions-button';
import { ModalRoutes } from './modal-routes';

const router = createBrowserRouter([
  {
    element: (
      <DrawerRouteProvider>
        <ModalRouteProvider>
          <BottomSheetRouteProvider>
            <ProfileAuthGuard disableProfileVerification>
              <Layout>
                <Outlet />
                <FloatingActionsButton />
              </Layout>
              <DrawerRoutes />
              <ModalRoutes />
              <BottomSheetRoutes />
            </ProfileAuthGuard>
          </BottomSheetRouteProvider>
        </ModalRouteProvider>
      </DrawerRouteProvider>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD,
        Component: lazyLoad(() => import('../pages/dashboard/page')),
        handle: {
          floatingActionButton: [
            {
              label: 'Add Transaction',
              link: DRAWER_ROUTES.NEW_TRANSACTION,
              type: PAGE_HANDLES.DRAWER,
            },
            {
              label: 'View Accounts',
              link: DEEP_LINKS.ACCOUNTS,
              type: PAGE_HANDLES.PAGE,
            },
            {
              label: 'View Categories',
              link: DEEP_LINKS.CATEGORIES,
              type: PAGE_HANDLES.PAGE,
            },
          ],
        },
      },
      {
        path: ROUTES.TRANSACTIONS_ALT,

        children: [
          {
            index: true,
            Component: lazyLoad(() => import('../pages/transactions/page')),
            handle: {
              floatingActionButton: [
                {
                  label: 'Add Transaction',
                  link: DRAWER_ROUTES.NEW_TRANSACTION,
                  type: PAGE_HANDLES.DRAWER,
                },
                {
                  label: 'Manage Scheduled Payments',
                  link: DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS,
                  type: PAGE_HANDLES.PAGE,
                },
              ],
            },
          },
          {
            path: ROUTES.TRANSACTIONS_DATE,
            Component: lazyLoad(() => import('../pages/transactions/page')),
            handle: {
              floatingActionButton: [
                {
                  label: 'Add Transaction',
                  link: DRAWER_ROUTES.NEW_TRANSACTION,
                  type: PAGE_HANDLES.DRAWER,
                },
                {
                  label: 'Manage Scheduled Payments',
                  link: DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS,
                  type: PAGE_HANDLES.PAGE,
                },
              ],
            },
          },
        ],
      },
      {
        path: ROUTES.ACCOUNTS,
        Component: lazyLoad(() => import('../pages/accounts/page')),
      },
      {
        path: ROUTES.CATEGORIES,
        Component: lazyLoad(() => import('../pages/categories/page')),
      },
      {
        path: ROUTES.SUMMARY,
        Component: SummaryLayout,
        children: [
          {
            index: true,
            Component: lazyLoad(() => import('../pages/summary-overview/page')),
          },
          {
            path: ROUTES.SUMMARY_BREAKDOWN,
            Component: lazyLoad(() => import('../pages/summary-breakdown/page')),
          },
        ],
      },
      {
        path: ROUTES.SETTINGS,
        Component: lazyLoad(() => import('../pages/settings-preferences/page')),
      },
      {
        path: ROUTES.SETTINGS_ACCOUNT_GROUPS,
        Component: lazyLoad(() => import('../pages/settings-account-groups/page')),
      },
      {
        path: ROUTES.SETTINGS_CATEGORY_GROUPS,
        Component: lazyLoad(() => import('../pages/settings-category-groups/page')),
      },
      {
        path: ROUTES.SETTINGS_SCHEDULED_PAYMENTS,
        Component: lazyLoad(() => import('../pages/settings-scheduled-payments/page')),
        children: [
          {
            index: true,
            Component: lazyLoad(() => import('../pages/settings-scheduled-payments-installment/page')),
            handle: {
              floatingActionButton: [
                {
                  label: 'Add Installment Payment',
                  link: DRAWER_ROUTES.NEW_SCHEDULED_PAYMENTS,
                  type: PAGE_HANDLES.DRAWER,
                },
              ],
            },
          },
          {
            path: ROUTES.SETTINGS_SCHEDULED_PAYMENTS_RECURRING,
            Component: lazyLoad(() => import('../pages/settings-scheduled-payments-recurring/page')),
            handle: {
              floatingActionButton: [
                {
                  label: 'Add Recurring Payment',
                  link: DRAWER_ROUTES.NEW_SCHEDULED_PAYMENTS,
                  type: PAGE_HANDLES.DRAWER,
                },
              ],
            },
          },
        ],
      },
      {
        path: ROUTES.SETTINGS_BACKUP,
        Component: lazyLoad(() => import('../pages/settings-backup/page')),
      },
      {
        path: ROUTES.SETTINGS_REPORTS_DAILY_OVERVIEW,
        Component: lazyLoad(() => import('../pages/settings-reports-daily-overview/page')),
      },
    ],
  },
]);

export const PageRouter = () => {
  return <RouterProvider router={router} />;
};
