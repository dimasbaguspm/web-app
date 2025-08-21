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
        path: ROUTES.MARKETPLACE,
        Component: lazy(() => import('../pages/marketplace/page')),
      },
      {
        path: ROUTES.MARKETPLACE_DETAIL,
        lazy: async () => {
          const { default: MarketplaceDetailPage } = await import(
            '../pages/marketplace-detail/page'
          );

          return { Component: MarketplaceDetailPage };
        },
      },
      {
        path: ROUTES.GROUPS,
        Component: lazy(() => import('../pages/groups/page')),
      },
      {
        path: ROUTES.PROFILES,
        Component: lazy(() => import('../pages/profiles/page')),
      },
      {
        path: ROUTES.ACCOUNTS,
        Component: lazy(() => import('../pages/account/page')),
      },
    ],
  },
]);

export const PageRouter = () => {
  return <RouterProvider router={router} />;
};
