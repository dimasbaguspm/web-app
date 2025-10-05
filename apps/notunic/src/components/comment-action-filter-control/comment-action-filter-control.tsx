import { If } from '@dimasbaguspm/utils/if';
import { ButtonGroup, ButtonMenu, Icon } from '@dimasbaguspm/versaur';
import { startCase } from 'lodash';
import { ChevronDownIcon } from 'lucide-react';
import { FC } from 'react';

import { useCommentActionFilter } from '../../hooks/use-comment-action-filter';

interface CommentActionFiltersControlProps {
  config: ReturnType<typeof useCommentActionFilter>;
  hideStatusFilter?: boolean;
}

export const CommentActionFiltersControl: FC<CommentActionFiltersControlProps> = ({ config, hideStatusFilter }) => {
  const { filters, appliedFilters } = config;

  const handleOnTypeFilterClick = (name: string) => {
    const currentTypes = filters.getAll('status') || [];
    if (currentTypes.includes(name)) {
      filters.removeSingle('status', name);
    } else {
      filters.replaceSingle('status', name);
    }
  };

  return (
    <ButtonGroup hasMargin>
      <If condition={!hideStatusFilter}>
        <ButtonMenu
          variant="outline"
          size="md"
          label={
            <>
              <Icon as={ChevronDownIcon} color="inherit" size="sm" />
              {startCase(appliedFilters.status || 'Status')}
            </>
          }
        >
          <ButtonMenu.Item
            onClick={() => handleOnTypeFilterClick('todo')}
            active={filters.getAll('type')?.includes('todo')}
          >
            Todo
          </ButtonMenu.Item>
          <ButtonMenu.Item
            onClick={() => handleOnTypeFilterClick('done')}
            active={filters.getAll('type')?.includes('done')}
          >
            Done
          </ButtonMenu.Item>
        </ButtonMenu>
      </If>
    </ButtonGroup>
  );
};
