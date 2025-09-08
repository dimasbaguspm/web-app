import { BottomSheetRouteProvider } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { DrawerRouteProvider } from '@dimasbaguspm/providers/drawer-route-provider';
import { ModalRouteProvider } from '@dimasbaguspm/providers/modal-route-provider';
import { lazy } from 'react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router';

import { ROUTES } from '../constants/page-routes';

import { AppLayout } from './app-layout';
import { DrawerRoutes } from './drawer-routes';
import { ModalRoutes } from './modal-routes';

const router = createBrowserRouter([
  {
    element: (
      <DrawerRouteProvider>
        <ModalRouteProvider>
          <BottomSheetRouteProvider>
            <AppLayout>
              <Outlet />
            </AppLayout>
            <ModalRoutes />
            <DrawerRoutes />
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
        children: [
          {
            index: true,
            Component: lazy(() => import('../pages/marketplace/page')),
          },
          {
            path: ROUTES.MARKETPLACE_DETAIL,
            Component: lazy(() => import('../pages/marketplace-detail/page')),
          },
        ],
      },
      {
        path: ROUTES.GROUPS,
        Component: lazy(() => import('../pages/groups/page')),
      },
      {
        path: ROUTES.SETTINGS,
        Component: lazy(() => import('../pages/settings/page')),
      },
    ],
  },
]);

export const PageRouter = () => {
  return <RouterProvider router={router} />;
};
