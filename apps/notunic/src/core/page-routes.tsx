import { ProfileAuthGuard } from '@dimasbaguspm/providers/active-app-profile-provider';
import { BottomSheetRouteProvider } from '@dimasbaguspm/providers/bottom-sheet-route-provider';
import { DrawerRouteProvider } from '@dimasbaguspm/providers/drawer-route-provider';
import { ModalRouteProvider } from '@dimasbaguspm/providers/modal-route-provider';
import { lazyLoad } from '@dimasbaguspm/utils/lazy-load';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';

import { ROUTES } from '../constants/page-routes';

import { AppLayout } from './app-layout';
import { BottomSheetRoutes } from './bottom-sheet-routes';
import { DrawerRoutes } from './drawer-routes';
import { ModalRoutes } from './modal-routes';

const router = createBrowserRouter([
  {
    element: (
      <DrawerRouteProvider>
        <ModalRouteProvider>
          <BottomSheetRouteProvider>
            <ProfileAuthGuard>
              <AppLayout>
                <Outlet />
              </AppLayout>
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
        path: ROUTES.SPACES,
        Component: lazyLoad(() => import('../pages/spaces/page')),
      },
      {
        path: ROUTES.MY_ACTIONS,
        Component: lazyLoad(() => import('../pages/my-actions/page')),
      },
    ],
  },
]);

export const PageRouter = () => {
  return <RouterProvider router={router} />;
};
