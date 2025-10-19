import { useApiNotunicCommentCategoriesInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { If } from '@dimasbaguspm/utils/if';
import { ButtonGroup, ButtonMenu, Icon } from '@dimasbaguspm/versaur';
import { startCase } from 'lodash';
import { ChevronDownIcon } from 'lucide-react';
import { FC } from 'react';

import { useCommentCategoryFilter } from '../../hooks/use-comment-category-filter';

interface CommentCategoryFiltersControlProps {
  config: ReturnType<typeof useCommentCategoryFilter>;
  hideSingleSelect?: boolean;
  singleSelectValue?: number | null;
  onSingleSelectChange?: (categoryId: number | null) => void;
  hideMultiSelect?: boolean;
  multiSelectValue?: number[];
  onMultiSelectChange?: (categoryIds: number[]) => void;
}

export const CommentCategoryFiltersControl: FC<CommentCategoryFiltersControlProps> = ({
  config,
  hideSingleSelect,
  singleSelectValue,
  onSingleSelectChange,
  hideMultiSelect,
  multiSelectValue,
  onMultiSelectChange,
}) => {
  const { filters, appliedFilters } = config;

  const [categories] = useApiNotunicCommentCategoriesInfiniteQuery({});

  const handleOnSingleFilterClick = (categoryId: number) => {
    const currentCategoryId = filters.getSingle('categoryId');
    if (currentCategoryId !== undefined && +currentCategoryId === categoryId) {
      filters.removeSingle('categoryId');
      onSingleSelectChange?.(null);
    } else {
      filters.replaceSingle('categoryId', categoryId);
      onSingleSelectChange?.(categoryId);
    }
  };

  const handleOnMultiFilterClick = (categoryId: number) => {
    const currentCategoryIds = filters.getAll('categoryIds') || [];
    if (currentCategoryIds.includes(`${categoryId}`)) {
      filters.removeSingle('categoryIds', categoryId);
      onMultiSelectChange?.(currentCategoryIds.filter((id) => id !== `${categoryId}`).map(Number));
    } else {
      filters.addSingle('categoryIds', categoryId);
      onMultiSelectChange?.([...currentCategoryIds.map(Number), categoryId]);
    }
  };

  const categoryIdValue = (onSingleSelectChange ? singleSelectValue : appliedFilters.categoryId) || null;
  const categoryIdsValue = (onMultiSelectChange ? multiSelectValue : appliedFilters.categoryIds) || [];

  if (!categories.length) {
    return null;
  }

  return (
    <ButtonGroup hasMargin>
      <If condition={!hideSingleSelect}>
        <ButtonMenu
          variant="outline"
          size="md"
          label={
            <>
              <Icon as={ChevronDownIcon} color="inherit" size="sm" />
              {startCase(categories.find((cat) => cat.id === categoryIdValue)?.name || 'Category')}
            </>
          }
        >
          {categories.map((category) => {
            return (
              <ButtonMenu.Item
                key={category.id}
                onClick={() => handleOnSingleFilterClick(category.id)}
                active={categoryIdValue === category.id}
              >
                {category.name || 'Uncategorized'}
              </ButtonMenu.Item>
            );
          })}
        </ButtonMenu>
      </If>
      <If condition={!hideMultiSelect}>
        <ButtonMenu
          variant="outline"
          size="md"
          label={
            <>
              <Icon as={ChevronDownIcon} color="inherit" size="sm" />
              Categories
            </>
          }
        >
          {categories.map((category) => {
            return (
              <ButtonMenu.Item
                key={category.id}
                onClick={() => handleOnMultiFilterClick(category.id)}
                active={categoryIdsValue.includes(category.id)}
              >
                {category.name || 'Uncategorized'}
              </ButtonMenu.Item>
            );
          })}
        </ButtonMenu>
      </If>
    </ButtonGroup>
  );
};
