import { useApiNotunicThreadCategoriesInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader, SelectableSingleInput } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC, useState } from 'react';

interface SelectThreadCategoryDrawerProps {
  returnToDrawer: string;
  returnToDrawerId?: Record<string, string> | null;
  payloadId: string;
  payload: Record<string, unknown>;
}

export const SelectSingleThreadCategoryDrawer: FC<SelectThreadCategoryDrawerProps> = ({
  returnToDrawer,
  returnToDrawerId,
  payloadId,
  payload,
}) => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number | null>(
    typeof payload?.[payloadId] === 'number' ? payload[payloadId] : null,
  );

  const [threadCategories, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiNotunicThreadCategoriesInfiniteQuery({});

  const handleOnSubmit = () => {
    openDrawer(returnToDrawer, returnToDrawerId, {
      replace: true,
      state: {
        payload: {
          ...payload,
          [payloadId]: selectedCategoryIds,
        },
      },
    });
  };

  const handleOnCancel = () => {
    openDrawer(returnToDrawer, returnToDrawerId, {
      replace: true,
      state: {
        payload,
      },
    });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Select Thread Category</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <If condition={isInitialFetching}>
        <Drawer.Body>
          <PageLoader />
        </Drawer.Body>
      </If>
      <If condition={!isInitialFetching}>
        <Drawer.Body>
          <If condition={!threadCategories.length}>
            <NoResults
              icon={SearchXIcon}
              title="No Thread Categories"
              subtitle="There are no thread categories available"
            />
          </If>
          <If condition={Boolean(threadCategories.length)}>
            <ul className="mb-4">
              {threadCategories.map((category) => (
                <li key={category.id}>
                  <SelectableSingleInput
                    label={category.name}
                    value={category.id.toString()}
                    name="thread-category"
                    checked={category.id === selectedCategoryIds}
                    onChange={() => setSelectedCategoryIds(category.id)}
                  />
                </li>
              ))}
            </ul>
            <If condition={hasNextPage}>
              <ButtonGroup alignment="center">
                <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                  Load more
                </Button>
              </ButtonGroup>
            </If>
          </If>
        </Drawer.Body>
        <Drawer.Footer>
          <ButtonGroup fluid={!isDesktop} alignment="end">
            <Button variant="ghost" onClick={handleOnCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleOnSubmit} disabled={!selectedCategoryIds}>
              Select
            </Button>
          </ButtonGroup>
        </Drawer.Footer>
      </If>
    </>
  );
};
