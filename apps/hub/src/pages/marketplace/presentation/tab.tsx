import { Tabs, TabsRootProps } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { DEEP_LINKS } from '../../../constants/routes';

const enum TabValues {
  INSTALLED = 'installed',
  AVAILABLE = 'available',
}
export const Tab: FC<Partial<TabsRootProps>> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (tab: string) => {
    if (tab === TabValues.INSTALLED) {
      navigate(DEEP_LINKS.MARKETPLACE_INSTALLED.path);
    } else if (tab === TabValues.AVAILABLE) {
      navigate(DEEP_LINKS.MARKETPLACE_AVAILABLE.path);
    }
  };

  return (
    <Tabs
      {...props}
      value={
        location.pathname.includes(TabValues.INSTALLED)
          ? TabValues.INSTALLED
          : TabValues.AVAILABLE
      }
      onValueChange={handleTabChange}
    >
      <Tabs.Trigger value={TabValues.AVAILABLE}>Available</Tabs.Trigger>
      <Tabs.Trigger value={TabValues.INSTALLED}>Installed</Tabs.Trigger>
    </Tabs>
  );
};
