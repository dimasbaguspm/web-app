import { useApiSpenicleAccountGroupsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { If } from '@dimasbaguspm/utils/if';
import { ButtonGroup, ButtonMenu, Icon } from '@dimasbaguspm/versaur';
import { startCase } from 'lodash';
import { ChevronDownIcon } from 'lucide-react';
import { FC } from 'react';

import { useAccountFilter } from '../../hooks/use-account-filter';

interface AccountFiltersControlProps {
  config: ReturnType<typeof useAccountFilter>;
  hideTypeFilter?: boolean;
  hideGroupFilter?: boolean;
}

export const AccountFiltersControl: FC<AccountFiltersControlProps> = ({ config, hideTypeFilter, hideGroupFilter }) => {
  const { filters } = config;
  const [accountGroups] = useApiSpenicleAccountGroupsInfiniteQuery({ pageSize: 15, sortBy: 'name', sortOrder: 'asc' });

  const handleOnTypeFilterClick = (name: string) => {
    const currentTypes = filters.getAll('type');
    if (currentTypes.includes(name)) {
      filters.removeSingle('type', name);
    } else {
      filters.replaceSingle('type', name);
    }
  };

  const handleOnGroupFilterClick = (id: string) => {
    const currentGroups = filters.getAll('groupId');
    if (currentGroups.includes(id)) {
      filters.removeSingle('groupId', id);
    } else {
      filters.addSingle('groupId', id);
    }
  };

  const hasTypeFilter = !!filters.getAll('type')?.length;

  return (
    <ButtonGroup hasMargin>
      <If condition={!hideTypeFilter}>
        <ButtonMenu
          variant="outline"
          size="md"
          label={
            <>
              <Icon as={ChevronDownIcon} color="inherit" size="sm" />
              {hasTypeFilter ? startCase(filters.getSingle('type') || '') : 'Type'}
            </>
          }
        >
          <ButtonMenu.Item
            onClick={() => handleOnTypeFilterClick('expense')}
            active={filters.getAll('type')?.includes('expense')}
          >
            Expense
          </ButtonMenu.Item>
          <ButtonMenu.Item
            onClick={() => handleOnTypeFilterClick('income')}
            active={filters.getAll('type')?.includes('income')}
          >
            Income
          </ButtonMenu.Item>
        </ButtonMenu>
      </If>
      <If condition={[!hideGroupFilter, accountGroups?.length]}>
        <ButtonMenu
          variant="outline"
          size="md"
          preserve
          label={
            <>
              <Icon as={ChevronDownIcon} color="inherit" size="sm" />
              Group {filters.getAll('groupId')?.length ? `(${filters.getAll('groupId').length})` : null}
            </>
          }
        >
          {accountGroups?.map((group) => (
            <ButtonMenu.Item
              key={group.id}
              onClick={() => handleOnGroupFilterClick(group.id.toString())}
              active={filters.getAll('groupId')?.includes(group.id.toString())}
            >
              {group.name}
            </ButtonMenu.Item>
          ))}
        </ButtonMenu>
      </If>
    </ButtonGroup>
  );
};
