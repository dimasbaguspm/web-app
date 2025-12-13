import { useApiSpenicleCategoryQuery, useApiSpenicleCreateCategoryBudget } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader, useSnackbars } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { NewCategoryBudgetForm } from './form';
import { NewCategoryBudgetFormValues } from './types';

interface NewCategoryBudgetDrawerProps {
  categoryId: number;
}

export const NewCategoryBudgetDrawer: FC<NewCategoryBudgetDrawerProps> = ({ categoryId }) => {
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();
  const { isDesktop } = useWindowResize();

  const [category, , { isPending: isCategoryLoading }] = useApiSpenicleCategoryQuery(categoryId);

  const [createBudget, , { isPending: isCreatingBudget }] = useApiSpenicleCreateCategoryBudget();
  const { name } = formatSpenicleCategory(category);

  const handleOnValidSubmit = async (data: NewCategoryBudgetFormValues) => {
    await createBudget({
      categoryId,
      maxAmount: parseFloat(data.maxAmount),
      frequency: data.frequency,
      type: data.type,
      note: data.notes,
    });
    showSnack('success', 'Category budget created successfully');
    closeDrawer();
  };

  const isDataLoading = isCategoryLoading;
  const isDataSubmitLoading = isCreatingBudget;

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Setup {name} Budget</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={!isDataLoading}>
          <If condition={!!category}>
            <NewCategoryBudgetForm category={category!} onSubmit={handleOnValidSubmit} />
          </If>
          <If condition={!category}>
            <NoResults
              icon={SearchXIcon}
              title="Category not found"
              subtitle="The category you are trying to set a budget for does not exist."
            />
          </If>
        </If>
        <If condition={isDataLoading}>
          <PageLoader />
        </If>
      </Drawer.Body>
      <If condition={[!isDataLoading, !!category]}>
        <Drawer.Footer>
          <ButtonGroup alignment="end" fluid={!isDesktop}>
            <Button variant="ghost" onClick={closeDrawer}>
              Cancel
            </Button>
            <Button type="submit" form="new-category-budget-form" disabled={isDataSubmitLoading}>
              Create
            </Button>
          </ButtonGroup>
        </Drawer.Footer>
      </If>
    </>
  );
};
