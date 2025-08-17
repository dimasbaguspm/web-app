import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { DRAWER_PARAM_KEY, DRAWER_ROUTES } from '../../constants/drawer-routes';

export const useDrawerRoute = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [additionalParams, setAdditionalParams] = useState<Record<
    string,
    string
  > | null>(
    searchParams.size > 0 ? Object.fromEntries(searchParams.entries()) : null,
  );

  const drawerParam = searchParams.get(DRAWER_PARAM_KEY) as
    | keyof typeof DRAWER_ROUTES
    | null;

  const drawerRoute = drawerParam ? DRAWER_ROUTES[drawerParam] : null;
  const isDrawerOpen = Boolean(drawerParam);

  const handleCloseDrawer = () => {
    setSearchParams({});
    setAdditionalParams(null);
  };

  const handleOpenDrawer = (
    route: keyof typeof DRAWER_ROUTES,
    params?: object,
  ) => {
    setSearchParams((prev) => {
      return {
        ...prev,
        ...Object.fromEntries(Object.entries(params || {})),
        [DRAWER_PARAM_KEY]: route,
      };
    });
    setAdditionalParams(
      params
        ? Object.fromEntries(
            Object.entries(params).map(([k, v]) => [k, String(v)]),
          )
        : null,
    );
  };

  return {
    isDrawerOpen,
    drawerRoute,
    additionalParams,
    handleCloseDrawer,
    handleOpenDrawer,
  };
};
