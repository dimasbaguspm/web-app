import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { PageLayout } from '../components/page-layout/page-layout';
import { ROUTES } from '../constants/routes';

const router = createBrowserRouter([
  {
    element: <PageLayout />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        Component: lazy(() => import('../pages/dashboard/page')),
      },
      {
        path: ROUTES.MARKETPLACE,
        Component: lazy(() => import('../pages/marketplace/page')),
      },
      {
        path: ROUTES.PROFILE,
        Component: lazy(() => import('../pages/profile/page')),
      },
    ],
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
