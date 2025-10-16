import { useApiNotunicCreateThread, useApiNotunicThreadCategoriesInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, ButtonGroup, Drawer, useSnackbars } from '@dimasbaguspm/versaur';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { NewThreadForm } from './form';
import { formatDefaultValues } from './helpers';
import { NewThreadFormSchema } from './types';

interface NewThreadDrawerProps {
  spaceId: number;
  payload?: Record<string, string>;
}

export const NewThreadDrawer: FC<NewThreadDrawerProps> = ({ spaceId, payload }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [createThread, , { isPending }] = useApiNotunicCreateThread();

  const form = useForm<NewThreadFormSchema>({
    defaultValues: formatDefaultValues({ ...payload, spaceId }),
  });

  const handleOnSubmit = async (data: NewThreadFormSchema) => {
    await createThread({
      spaceId: spaceId,
      title: data.title,
      content: data.content,
      categoryIds: data.categoryIds,
      tagIds: [],
    });
    showSnack('success', 'Thread created successfully');
    closeDrawer();
  };

  const selectedCategoryIds = form.watch('categoryIds');

  const [threadCategories] = useApiNotunicThreadCategoriesInfiniteQuery(
    {
      id: selectedCategoryIds,
      pageSize: selectedCategoryIds?.length || 1,
    },
    { enabled: !!selectedCategoryIds?.length },
  );

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>New Thread</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>

      <Drawer.Body>
        <form id="new-thread-form" onSubmit={form.handleSubmit(handleOnSubmit)}>
          <FormProvider {...form}>
            <NewThreadForm selectedCategories={threadCategories} />
          </FormProvider>
        </form>
      </Drawer.Body>
      <Drawer.Footer>
        <ButtonGroup fluid={!isDesktop} alignment="end">
          <Button variant="ghost" disabled={isPending} onClick={closeDrawer}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="new-thread-form" disabled={isPending}>
            Create
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
