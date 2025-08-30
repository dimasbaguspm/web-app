import { DrawerRouteProvider } from '@dimasbaguspm/providers/drawer-route-provider';
import { lazyLoad } from '@dimasbaguspm/utils/lazy-load';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';

import { ROUTES } from '../constants/page-routes';
import SummaryLayout from '../pages/summary/page';

import { AppLayout } from './app-layout';
import { DrawerRoutes } from './drawer-routes';

const router = createBrowserRouter([
  {
    element: (
      <DrawerRouteProvider>
        <AppLayout>
          <Outlet />
        </AppLayout>
        <DrawerRoutes />
      </DrawerRouteProvider>
    ),
    children: [
      {
        path: ROUTES.TRANSACTIONS,
        Component: lazyLoad(() => import('../pages/transactions/page')),
      },
      {
        path: ROUTES.TRANSACTIONS_ALT,
        Component: lazyLoad(() => import('../pages/transactions/page')),
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
    ],
  },
]);

export const PageRouter = () => {
  return <RouterProvider router={router} />;
};
