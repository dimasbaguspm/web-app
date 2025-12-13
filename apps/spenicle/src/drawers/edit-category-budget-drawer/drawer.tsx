import {
  useApiSpenicleCategoryBudgetQuery,
  useApiSpenicleCategoryQuery,
  useApiSpenicleUpdateCategoryBudget,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader, useSnackbars } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';

import { EditCategoryBudgetForm } from './form';
import { EditCategoryBudgetFormValues } from './types';

interface EditCategoryBudgetDrawerProps {
  categoryId: number;
  categoryBudgetId: number;
}

export const EditCategoryBudgetDrawer: FC<EditCategoryBudgetDrawerProps> = ({ categoryId, categoryBudgetId }) => {
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();
  const { isDesktop } = useWindowResize();

  const [category, , { isPending: isCategoryPending }] = useApiSpenicleCategoryQuery(categoryId);
  const [categoryBudget, , { isPending: isCategoryBudgetPending }] =
    useApiSpenicleCategoryBudgetQuery(categoryBudgetId);

  const [updateBudget, , { isPending: isUpdateBudgetPending }] = useApiSpenicleUpdateCategoryBudget();
  const { name } = formatSpenicleCategory(category);

  const handleOnValidSubmit = async (data: EditCategoryBudgetFormValues) => {
    await updateBudget({
      id: categoryBudgetId,
      categoryId,
      maxAmount: parseFloat(data.maxAmount),
      frequency: data.frequency,
      type: data.type,
      note: data.notes,
    });
    showSnack('success', 'Category budget updated successfully');
    closeDrawer();
  };

  const isDataLoading = isCategoryPending || isCategoryBudgetPending;
  const isSubmitLoading = isUpdateBudgetPending;

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Edit {name} Budget</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isDataLoading}>
          <PageLoader />
        </If>
        <If condition={!isDataLoading}>
          <If condition={!!categoryBudget}>
            <EditCategoryBudgetForm categoryBudget={categoryBudget!} onSubmit={handleOnValidSubmit} />
          </If>
          <If condition={!categoryBudget}>
            <NoResults
              icon={SearchXIcon}
              title="Budget not found"
              subtitle="The category budget you are trying to edit does not exist."
            />
          </If>
        </If>
      </Drawer.Body>
      <If condition={[!isDataLoading, !!categoryBudget]}>
        <Drawer.Footer>
          <ButtonGroup alignment="end" fluid={!isDesktop}>
            <Button variant="ghost" onClick={closeDrawer}>
              Cancel
            </Button>
            <Button type="submit" form="edit-category-budget-form" disabled={isSubmitLoading}>
              Update
            </Button>
          </ButtonGroup>
        </Drawer.Footer>
      </If>
    </>
  );
};
