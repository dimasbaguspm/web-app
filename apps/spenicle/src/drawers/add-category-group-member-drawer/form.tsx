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

interface FormProps {
  handleCreateNewCategory: () => void;
  handleOnCategorySelect: (ids: number[]) => void;
  categoryIds: number[];
}
export const Form: FC<FormProps> = ({ handleCreateNewCategory, handleOnCategorySelect, categoryIds }) => {
  const [searchTerm, setSearchTerm] = useDebouncedState<string>();

  const [categories, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiSpenicleCategoriesInfiniteQuery({
      search: searchTerm,
    });

  return (
    <>
      <div className="mb-4">
        <SearchInput
          defaultValue={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
        />
      </div>

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
            <Button variant="ghost" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
              Load more
            </Button>
          </ButtonGroup>
        </If>
      </If>
    </>
  );
};
