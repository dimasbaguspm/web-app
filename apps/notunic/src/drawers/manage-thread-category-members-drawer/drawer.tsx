import { useApiNotunicThreadCategoryQuery, useApiNotunicThreadsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatNotunicThread } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, NoResults, PageLoader, SelectableSingleInput } from '@dimasbaguspm/versaur';
import { noop } from 'lodash';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { ManageThreadCategoryMembersFormSchema } from './types';

export interface ManageThreadCategoryMembersDrawerProps {
  threadCategoryId: number;
}

export const ManageThreadCategoryMembersDrawer: FC<ManageThreadCategoryMembersDrawerProps> = ({ threadCategoryId }) => {
  const { isDesktop } = useWindowResize();
  const { closeDrawer } = useDrawerRoute();

  // TODO: thread category should list the meaningful data such members
  const [threadCategory, , { isLoading: isThreadCategoryQueryLoading }] =
    useApiNotunicThreadCategoryQuery(threadCategoryId);

  const [threads, , { isLoading: isThreadQueryLoading }] = useApiNotunicThreadsInfiniteQuery({});

  const form = useForm<ManageThreadCategoryMembersFormSchema>({
    defaultValues: {
      threadIds: [],
    },
  });

  const isLoading = isThreadCategoryQueryLoading || isThreadQueryLoading;
  const selectedThreadIds = form.watch('threadIds');

  // TODO: it should patch on bulk update endpoint
  const handleOnSubmit = (data: ManageThreadCategoryMembersFormSchema) => {
    console.log(data);
  };

  return (
    <>
      <If condition={isLoading}>
        <PageLoader />
      </If>
      <If condition={!isLoading}>
        <If condition={!threadCategory}>
          <Drawer.Header>
            <Drawer.Title>Manage Thread Category Members</Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>

          <Drawer.Body>
            <NoResults
              icon={SearchXIcon}
              title="Thread category not found"
              subtitle="The thread category does not exist"
            />
          </Drawer.Body>
        </If>
        <If condition={Boolean(threadCategory)}>
          <Drawer.Header>
            <Drawer.Title>Manage Members for {threadCategory?.name || 'Thread'} Category</Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <If condition={threads.length === 0}>
              <NoResults
                icon={SearchXIcon}
                title="No Threads Found"
                subtitle="There are no threads available to add to this category"
              />
            </If>
            <If condition={threads.length > 0}>
              <ul className="flex flex-col gap-4 mb-4">
                {threads.map((thread) => (
                  <li key={thread.id}>
                    <SelectableSingleInput
                      value={thread.id.toString()}
                      label={formatNotunicThread(thread).title}
                      name="threads"
                      checked={selectedThreadIds.includes(thread.id.toString())}
                      onChange={noop}
                      onClick={() => {
                        const currentValues = form.getValues('threadIds');
                        if (currentValues.includes(thread.id.toString())) {
                          form.setValue(
                            'threadIds',
                            currentValues.filter((id) => id !== thread.id.toString()),
                          );
                        } else {
                          form.setValue('threadIds', [...currentValues, thread.id.toString()]);
                        }
                      }}
                    />
                  </li>
                ))}
              </ul>
            </If>
          </Drawer.Body>
          <Drawer.Footer>
            <ButtonGroup alignment="end" fluid={!isDesktop}>
              <Button variant="ghost" onClick={closeDrawer}>
                Cancel
              </Button>
              <Button variant="primary" onClick={form.handleSubmit(handleOnSubmit)}>
                Save
              </Button>
            </ButtonGroup>
          </Drawer.Footer>
        </If>
      </If>
    </>
  );
};
