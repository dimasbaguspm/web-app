import { useApiSpenicleCategoriesInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  NoResults,
  PageLoader,
  SearchInput,
  SelectableMultipleInput,
} from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { CategoryCard } from '../../components/category-card';
import { CategoryFiltersControl } from '../../components/category-filter-control';
import { useCategoryFilter } from '../../hooks/use-category-filter';

interface FormProps {
  handleCreateNewCategory: () => void;
  handleOnCategorySelect: (ids: number[]) => void;
  categoryIds: number[];
}
export const Form: FC<FormProps> = ({ handleCreateNewCategory, handleOnCategorySelect, categoryIds }) => {
  const [searchTerm, setSearchTerm] = useDebouncedState<string>();
  const filter = useCategoryFilter({ adapter: 'state' });

  const [categories, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiSpenicleCategoriesInfiniteQuery({
      ...filter.appliedFilters,
      search: searchTerm,
      pageSize: 15,
    });

  return (
    <>
      <div className="mb-4">
        <SearchInput
          variant="neutral"
          defaultValue={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
        />
      </div>
      <CategoryFiltersControl config={filter} hideGroupFilter />

      <If condition={isInitialFetching}>
        <PageLoader />
      </If>
      <If condition={[!isInitialFetching, !categories.length]}>
        <NoResults
          icon={SearchXIcon}
          title="No categories found"
          subtitle="There are no categories available to add to this group"
          action={
            <ButtonGroup alignment="center">
              <Button variant="outline" onClick={handleCreateNewCategory}>
                Create
              </Button>
            </ButtonGroup>
          }
        />
      </If>

      <If condition={!!categories.length}>
        <ul className="mb-4">
          {categories.map((category) => {
            return (
              <li key={category.id}>
                <SelectableMultipleInput
                  label={<CategoryCard category={category} as="div" size="none" />}
                  checked={categoryIds.includes(category.id)}
                  value={category.id.toString()}
                  onChange={() => {
                    if (categoryIds.includes(category.id)) {
                      handleOnCategorySelect(categoryIds.filter((id) => id !== category.id));
                    } else {
                      handleOnCategorySelect([...categoryIds, category.id]);
                    }
                  }}
                />
              </li>
            );
          })}
        </ul>
        <If condition={hasNextPage}>
          <ButtonGroup alignment="center">
            <Button variant="outline" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
              Load More
            </Button>
          </ButtonGroup>
        </If>
      </If>
    </>
  );
};
