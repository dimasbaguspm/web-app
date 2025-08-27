import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { ChipSingleInput, Icon } from '@dimasbaguspm/versaur';
import { CalendarCheck2Icon, ChartBarBigIcon, TargetIcon } from 'lucide-react';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { DEEP_LINKS } from '../../../constants/page-routes';

export const ActionHeader: FC = () => {
  const { isDesktop } = useWindowResize();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOnNavigate = (value: 'overview' | 'calendar' | 'timeline') => {
    navigate({
      pathname:
        value === 'calendar'
          ? DEEP_LINKS.SUMMARY_CALENDAR.path
          : value === 'timeline'
            ? DEEP_LINKS.SUMMARY_TIMELINE.path
            : DEEP_LINKS.SUMMARY.path,
    });
  };

  return (
    <ChipSingleInput
      value={
        location.pathname === DEEP_LINKS.SUMMARY.path
          ? 'overview'
          : location.pathname === DEEP_LINKS.SUMMARY_CALENDAR.path
            ? 'calendar'
            : 'timeline'
      }
      label=""
      size="md"
      name="1"
      onChange={(data) =>
        handleOnNavigate(data as 'overview' | 'calendar' | 'timeline')
      }
    >
      <ChipSingleInput.Option value="overview">
        <Icon as={TargetIcon} color="inherit" size="sm" />
        {isDesktop && 'Overview'}
      </ChipSingleInput.Option>
      <ChipSingleInput.Option value="calendar">
        <Icon as={CalendarCheck2Icon} color="inherit" size="sm" />
        {isDesktop && 'Calendar'}
      </ChipSingleInput.Option>
      <ChipSingleInput.Option value="timeline">
        <Icon as={ChartBarBigIcon} color="inherit" size="sm" />
        {isDesktop && 'Timeline'}
      </ChipSingleInput.Option>
    </ChipSingleInput>
  );
};
