import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

import { DRAWER_PARAM_KEY, DRAWER_ROUTES } from '../../constants/drawer-routes';

export const useDrawerRoute = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const drawerParam = searchParams.get(DRAWER_PARAM_KEY) as
    | keyof typeof DRAWER_ROUTES
    | null;

  const drawerRoute = drawerParam ? DRAWER_ROUTES[drawerParam] : null;
  const isDrawerOpen = Boolean(drawerParam);

  // Extract additional parameters (all search params except the drawer param)
  const additionalParams = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [DRAWER_PARAM_KEY]: _, ...rest } = params;

    return Object.keys(rest).length > 0 ? rest : null;
  }, [searchParams]);

  const handleCloseDrawer = () => {
    setSearchParams({});
  };

  const handleOpenDrawer = (
    route: keyof typeof DRAWER_ROUTES,
    params?: object,
  ) => {
    setSearchParams(() => {
      // Clear previous params and set new ones
      const newParams = {
        ...Object.fromEntries(Object.entries(params || {})),
        [DRAWER_PARAM_KEY]: route,
      };
      return newParams;
    });
  };

  return {
    isDrawerOpen,
    drawerRoute,
    additionalParams,
    handleCloseDrawer,
    handleOpenDrawer,
  };
};
