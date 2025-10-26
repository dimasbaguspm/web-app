import { BottomSheetRouteProvider } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { DrawerRouteProvider } from '@dimasbaguspm/providers/drawer-route-provider';
import { ModalRouteProvider } from '@dimasbaguspm/providers/modal-route-provider';
import { lazy } from 'react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router';

import { ROUTES } from '../constants/page-routes';

import { Layout } from './app-layout';
import { DrawerRoutes } from './drawer-routes';
import { ModalRoutes } from './modal-routes';

const router = createBrowserRouter([
  {
    element: (
      <DrawerRouteProvider>
        <ModalRouteProvider>
          <BottomSheetRouteProvider>
            <Layout>
              <Outlet />
            </Layout>
            <DrawerRoutes />
            <ModalRoutes />
          </BottomSheetRouteProvider>
        </ModalRouteProvider>
      </DrawerRouteProvider>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to={ROUTES.MARKETPLACE} replace />,
      },
      {
        path: ROUTES.MARKETPLACE,
        Component: lazy(() => import('../pages/marketplace/page')),
      },
      {
        path: ROUTES.GROUPS,
        Component: lazy(() => import('../pages/groups/page')),
      },
      {
        path: ROUTES.SETTINGS,
        Component: lazy(() => import('../pages/settings/page')),
      },
      {
        path: ROUTES.ADMINS,
        Component: lazy(() => import('../pages/admins/page')),
      },
    ],
  },
]);

export const PageRouter = () => {
  return <RouterProvider router={router} />;
};
