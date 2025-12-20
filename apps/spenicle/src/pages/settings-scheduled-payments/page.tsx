import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { Button, ButtonGroup, ChipSingleInput, Icon, PageContent, PageHeader, PageLayout } from '@dimasbaguspm/versaur';
import { FilterIcon, CalendarRangeIcon, CalendarSyncIcon } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { DEEP_LINKS } from '../../constants/page-routes';

const enum ScheduledPaymentPage {
  INSTALLMENT = 'installment',
  RECURRING = 'recurring',
}

const SettingsScheduledPaymentPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { isDesktop } = useWindowResize();

  const handleOnChipChange = (value: string) => {
    if (value === ScheduledPaymentPage.INSTALLMENT) {
      navigate(DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS.path);
    } else {
      navigate(DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS_RECURRING.path);
    }
  };

  return (
    <PageLayout>
      <PageLayout.HeaderRegion>
        <PageHeader
          title="Scheduled Payments"
          subtitle="Manage your payment schedules and recurring transactions"
          size="wide"
        />
      </PageLayout.HeaderRegion>

      <PageLayout.ContentRegion>
        <PageContent size="wide">
          <ButtonGroup alignment="between" hasMargin>
            <Button variant="outline">
              <Icon as={FilterIcon} color="inherit" size="sm" />
              Filter
            </Button>

            <ChipSingleInput
              value={
                pathname === DEEP_LINKS.SETTINGS_SCHEDULED_PAYMENTS.path
                  ? ScheduledPaymentPage.INSTALLMENT
                  : ScheduledPaymentPage.RECURRING
              }
              name="type"
              size="md"
              className="w-auto"
              onChange={handleOnChipChange}
            >
              <ChipSingleInput.Option value={ScheduledPaymentPage.INSTALLMENT}>
                <Icon as={CalendarRangeIcon} size="sm" color="inherit" />
                {isDesktop && 'Installment'}
              </ChipSingleInput.Option>
              <ChipSingleInput.Option value={ScheduledPaymentPage.RECURRING}>
                <Icon as={CalendarSyncIcon} size="sm" color="inherit" />
                {isDesktop && 'Recurring'}
              </ChipSingleInput.Option>
            </ChipSingleInput>
          </ButtonGroup>

          <Outlet />
        </PageContent>
      </PageLayout.ContentRegion>
    </PageLayout>
  );
};

export default SettingsScheduledPaymentPage;
