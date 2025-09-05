import {
  useApiSpenicleCategoryGroupQuery,
  useApiSpenicleCreateCategoryGroupMembers,
  useApiSpenicleDeleteCategoryGroupMembers,
} from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, PageLoader } from '@dimasbaguspm/versaur';
import { FC, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { Form } from './form';
import { AddCategoryGroupMemberFormSchema } from './types';

interface AddCategoryGroupMemberDrawerProps {
  categoryGroupId: number;
}

export const AddCategoryGroupMemberDrawer: FC<AddCategoryGroupMemberDrawerProps> = ({ categoryGroupId }) => {
  const { openDrawer, closeDrawer } = useDrawerRoute();
  const { isDesktop } = useWindowResize();

  const [categoryGroup, , { isLoading: isFetchingCategoryGroup }] = useApiSpenicleCategoryGroupQuery(categoryGroupId);
  const [addToGroupMembers, , { isPending: isPendingSubmit }] = useApiSpenicleCreateCategoryGroupMembers();
  const [removeFromGroupMembers, , { isPending: isPendingRemove }] = useApiSpenicleDeleteCategoryGroupMembers();

  const { handleSubmit, reset, setValue, watch } = useForm<AddCategoryGroupMemberFormSchema>({
    defaultValues: {
      categoryIds: categoryGroup?.memberIds,
    },
  });

  useEffect(() => {
    reset({
      categoryIds: categoryGroup?.memberIds || [],
    });
  }, [categoryGroup, reset]);

  const handleCreateNewCategory = () => {
    openDrawer(DRAWER_ROUTES.NEW_CATEGORY);
  };

  const handleOnCategorySelect = (ids: number[]) => {
    setValue('categoryIds', ids, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const handleOnSubmit: SubmitHandler<AddCategoryGroupMemberFormSchema> = async (data) => {
    const currentMemberIds = categoryGroup?.memberIds || [];
    const idsToRemove = currentMemberIds.filter((id) => !data.categoryIds.includes(id));
    const idsToAdd = data.categoryIds.filter((id) => !currentMemberIds.includes(id));

    if (idsToAdd.length) {
      await addToGroupMembers({
        categoryGroupId,
        categoryId: idsToAdd,
      });
    }
    if (idsToRemove.length) {
      await removeFromGroupMembers({
        categoryGroupId,
        categoryId: idsToRemove,
      });
    }

    closeDrawer();
  };

  const isPending = isPendingSubmit || isPendingRemove;

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Manage Members</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isFetchingCategoryGroup}>
          <PageLoader />
        </If>
        <If condition={!isFetchingCategoryGroup}>
          <Form
            categoryIds={watch('categoryIds') || []}
            handleCreateNewCategory={handleCreateNewCategory}
            handleOnCategorySelect={handleOnCategorySelect}
          />
        </If>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={closeDrawer} disabled={isPending}>
            Cancel
          </Button>
          <Button form="select-category-form" onClick={handleSubmit(handleOnSubmit)} disabled={isPending}>
            Save
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
