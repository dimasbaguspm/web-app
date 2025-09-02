import { PageContent, PageHeader, Tabs } from '@dimasbaguspm/versaur';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { DEEP_LINKS } from '../../constants/page-routes';

const SettingsLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isPreferences = pathname === DEEP_LINKS.SETTINGS.path;

  const handleOnNavigate = (value: string) => {
    navigate({
      pathname: value === 'preferences' ? DEEP_LINKS.SETTINGS.path : DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS.path,
    });
  };
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Manage your preferences"
        tabs={
          <Tabs value={isPreferences ? 'preferences' : 'scheduled-payments'} onValueChange={handleOnNavigate}>
            <Tabs.Trigger value="preferences">Preferences</Tabs.Trigger>
            <Tabs.Trigger value="scheduled-payments">Scheduled Payments</Tabs.Trigger>
          </Tabs>
        }
      />
      <PageContent>
        <Outlet />
      </PageContent>
    </>
  );
};

export default SettingsLayout;
