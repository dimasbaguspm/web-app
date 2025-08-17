/* eslint-disable import/max-dependencies */
import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { PageLayout } from '../components/page-layout/page-layout';
import { ROUTES } from '../constants/routes';

import { DrawerRoutes } from './drawer-routes';

const router = createBrowserRouter([
  {
    element: (
      <>
        <PageLayout />
        <DrawerRoutes />
      </>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD,
        Component: lazy(() => import('../pages/dashboard/page')),
      },
      {
        path: ROUTES.MARKETPLACE,
        Component: lazy(() => import('../pages/marketplace/page')),
        children: [
          {
            path: ROUTES.MARKETPLACE_AVAILABLE,
            Component: lazy(
              () => import('../pages/marketplace/sub-pages/available/page'),
            ),
          },
          {
            path: ROUTES.MARKETPLACE_INSTALLED,
            Component: lazy(
              () => import('../pages/marketplace/sub-pages/installed/page'),
            ),
          },
        ],
      },
      {
        path: ROUTES.PROFILE,
        Component: lazy(() => import('../pages/profile/page')),
      },
      {
        path: ROUTES.GROUPS,
        Component: lazy(() => import('../pages/groups/page')),
      },
    ],
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
