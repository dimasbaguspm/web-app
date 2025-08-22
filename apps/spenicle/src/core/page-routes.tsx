import { DrawerRouteProvider } from '@dimasbaguspm/providers/drawer-route-provider';
import { lazyLoad } from '@dimasbaguspm/utils/lazy-load';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';

import { ROUTES } from '../constants/page-routes';

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
        Component: lazyLoad(() => import('../pages/summary/page')),
      },
    ],
  },
]);

export const PageRouter = () => {
  return <RouterProvider router={router} />;
};
