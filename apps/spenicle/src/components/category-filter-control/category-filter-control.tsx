import { useApiSpenicleCategoryGroupsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { If } from '@dimasbaguspm/utils/if';
import { ButtonGroup, ButtonMenu, Icon } from '@dimasbaguspm/versaur';
import { ChevronDownIcon } from 'lucide-react';

import { useCategoryFilter } from '../../hooks/use-category-filter';

interface CategoryFiltersControlProps {
  config: ReturnType<typeof useCategoryFilter>;
  hideTypeFilter?: boolean;
  hideGroupFilter?: boolean;
}

export const CategoryFiltersControl = ({ config, hideGroupFilter, hideTypeFilter }: CategoryFiltersControlProps) => {
  const { filters } = config;

  const [categoryGroups] = useApiSpenicleCategoryGroupsInfiniteQuery({
    pageSize: 15,
    sortBy: 'name',
    sortOrder: 'asc',
  });

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

  return (
    <ButtonGroup hasMargin>
      <If condition={!hideTypeFilter}>
        <ButtonMenu
          variant="outline"
          size="sm"
          label={
            <>
              <Icon as={ChevronDownIcon} color="inherit" size="sm" />
              Type {filters.getAll('type')?.length ? `(${filters.getAll('type').length})` : null}
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
          <ButtonMenu.Item
            onClick={() => handleOnTypeFilterClick('transfer')}
            active={filters.getAll('type')?.includes('transfer')}
          >
            Transfer
          </ButtonMenu.Item>
        </ButtonMenu>
      </If>
      <If condition={!hideGroupFilter}>
        <ButtonMenu
          variant="outline"
          size="sm"
          preserve
          label={
            <>
              <Icon as={ChevronDownIcon} color="inherit" size="sm" />
              Group {filters.getAll('groupId')?.length ? `(${filters.getAll('groupId').length})` : null}
            </>
          }
        >
          {categoryGroups?.map((group) => (
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
