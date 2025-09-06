/* eslint-disable import/max-dependencies */
import { BottomSheetRouteProvider } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { DrawerRouteProvider } from '@dimasbaguspm/providers/drawer-route-provider';
import { ModalRouteProvider } from '@dimasbaguspm/providers/modal-route-provider';
import { lazyLoad } from '@dimasbaguspm/utils/lazy-load';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';

import { ROUTES } from '../constants/page-routes';
import SummaryLayout from '../pages/summary/page';

import { AppLayout } from './app-layout';
import { AppSession } from './app-session';
import { BottomSheetRoutes } from './bottom-sheet-routes';
import { DrawerRoutes } from './drawer-routes';
import { ModalRoutes } from './modal-routes';

const router = createBrowserRouter([
  {
    element: (
      <DrawerRouteProvider>
        <ModalRouteProvider>
          <BottomSheetRouteProvider>
            <AppLayout>
              <AppSession>
                <Outlet />
              </AppSession>
            </AppLayout>
            <DrawerRoutes />
            <ModalRoutes />
            <BottomSheetRoutes />
          </BottomSheetRouteProvider>
        </ModalRouteProvider>
      </DrawerRouteProvider>
    ),
    children: [
      {
        path: ROUTES.TRANSACTIONS,
        Component: lazyLoad(() => import('../pages/transactions/page')),
      },
      {
        path: ROUTES.TRANSACTIONS_ALT,
        children: [
          {
            index: true,
            Component: lazyLoad(() => import('../pages/transactions/page')),
          },
          {
            path: ROUTES.TRANSACTIONS_DATE,
            Component: lazyLoad(() => import('../pages/transactions/page')),
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
            path: ROUTES.SUMMARY_TRENDS,
            Component: lazyLoad(() => import('../pages/summary-trends/page')),
          },
          {
            path: ROUTES.SUMMARY_TIMELINE,
            Component: lazyLoad(() => import('../pages/summary-timeline/page')),
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
          },
          {
            path: ROUTES.SETTINGS_SCHEDULED_PAYMENTS_RECURRING,
            Component: lazyLoad(() => import('../pages/settings-scheduled-payments-recurring/page')),
          },
        ],
      },
    ],
  },
]);

export const PageRouter = () => {
  return <RouterProvider router={router} />;
};
