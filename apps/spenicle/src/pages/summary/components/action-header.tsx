import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import {
  Button,
  ButtonGroup,
  ChipSingleInput,
  Icon,
} from '@dimasbaguspm/versaur';
import {
  ChartBarBigIcon,
  ChartNoAxesCombinedIcon,
  FilterIcon,
  TargetIcon,
} from 'lucide-react';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import { DEEP_LINKS } from '../../../constants/page-routes';

export const ActionHeader: FC = () => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOnNavigate = (value: 'overview' | 'trends' | 'timeline') => {
    navigate({
      pathname:
        value === 'trends'
          ? DEEP_LINKS.SUMMARY_TRENDS.path
          : value === 'timeline'
            ? DEEP_LINKS.SUMMARY_TIMELINE.path
            : DEEP_LINKS.SUMMARY.path,
      search: location.search,
    });
  };

  const handleOnFilterClick = () => {
    openDrawer(DRAWER_ROUTES.FILTER_SUMMARY);
  };

  return (
    <div className="flex flex-row justify-between w-full mb-4">
      <ButtonGroup>
        <Button variant="outline" onClick={handleOnFilterClick}>
          <Icon as={FilterIcon} color="inherit" size="sm" />
          Filter
        </Button>
      </ButtonGroup>

      <ChipSingleInput
        value={
          location.pathname === DEEP_LINKS.SUMMARY.path
            ? 'overview'
            : location.pathname === DEEP_LINKS.SUMMARY_TRENDS.path
              ? 'trends'
              : 'timeline'
        }
        label=""
        size="md"
        name="1"
        className="w-auto"
        onChange={(data) =>
          handleOnNavigate(data as 'overview' | 'trends' | 'timeline')
        }
      >
        <ChipSingleInput.Option value="overview">
          <Icon as={TargetIcon} color="inherit" size="sm" />
          {isDesktop && 'Overview'}
        </ChipSingleInput.Option>
        <ChipSingleInput.Option value="timeline">
          <Icon as={ChartBarBigIcon} color="inherit" size="sm" />
          {isDesktop && 'Timeline'}
        </ChipSingleInput.Option>
        <ChipSingleInput.Option value="trends">
          <Icon as={ChartNoAxesCombinedIcon} color="inherit" size="sm" />
          {isDesktop && 'Trends'}
        </ChipSingleInput.Option>
      </ChipSingleInput>
    </div>
  );
};
