import { useApiSpenicleCategoriesInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useDebouncedState } from '@dimasbaguspm/hooks/use-debounced-state';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  LoadingIndicator,
  NoResults,
  SearchInput,
  SelectableMultipleInput,
  Text,
} from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

interface FormProps {
  handleCreateNewCategory: () => void;
  handleOnCategorySelect: (ids: number[]) => void;
  categoryIds: number[];
}
export const Form: FC<FormProps> = ({ handleCreateNewCategory, handleOnCategorySelect, categoryIds }) => {
  const [searchTerm, setSearchTerm] = useDebouncedState();

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
        <LoadingIndicator size="sm" type="bar" />
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
            const { name, type, variant } = formatSpenicleCategory(category);
            return (
              <li key={category.id}>
                <SelectableMultipleInput
                  label={
                    <div className="flex flex-col w-auto">
                      <Text className="mb-2" fontSize="base" fontWeight="semibold">
                        {name}
                      </Text>
                      <BadgeGroup>
                        <Badge color={variant} size="sm">
                          {type}
                        </Badge>
                      </BadgeGroup>
                    </div>
                  }
                  checked={categoryIds.includes(category.id)}
                  value={category.id.toString()}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleOnCategorySelect([...categoryIds, category.id]);
                    } else {
                      handleOnCategorySelect(categoryIds.filter((id) => id !== category.id));
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
