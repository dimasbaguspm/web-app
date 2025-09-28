import {
  useApiNotunicCommentsInfiniteQuery,
  useApiNotunicCreateComment,
  useApiNotunicThreadQuery,
} from '@dimasbaguspm/hooks/use-api';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { formatNotunicThread } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Drawer, FormLayout, Hr, NoResults, PageLoader, TextInput } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { CommentCard } from '../../components/comment-card';

interface DetailThreadDrawerProps {
  threadId: number;
}

export const DetailThreadDrawer: FC<DetailThreadDrawerProps> = ({ threadId }) => {
  const { user } = useAuthProvider();
  const [thread, , { isLoading }] = useApiNotunicThreadQuery(threadId);

  const { register, handleSubmit, reset } = useForm<{ content: string }>();

  const [createComment] = useApiNotunicCreateComment();

  const [comments, , { isInitialFetching, hasNextPage, isFetchingNextPage }, { fetchNextPage }] =
    useApiNotunicCommentsInfiniteQuery({
      threadId: threadId,
      sortBy: 'createdAt',
      sortOrder: 'asc',
    });

  const formattedThreadGroup = formatNotunicThread(thread);

  const handleOnSubmit = async (data: { content: string }) => {
    if (!data.content) return;

    await createComment({
      userId: user.id,
      threadId: threadId,
      content: data.content,
    });

    // Clear the input field
    reset();
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>{formattedThreadGroup.trimmedDescription ?? 'Thread Details'}</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <If condition={isLoading}>
          <PageLoader />
        </If>
        <If condition={[!isLoading, !thread]}>
          <NoResults
            icon={SearchXIcon}
            title="Thread not found"
            subtitle="The thread you are looking for does not exist."
          />
        </If>
        <If condition={[!isLoading, !!thread]}>
          <If condition={isInitialFetching}>
            <PageLoader />
          </If>
          <If condition={[!isInitialFetching, comments.length === 0]}>
            <NoResults icon={SearchXIcon} title="No comments" subtitle="There are no comments for this thread yet." />
          </If>
          <If condition={[!isInitialFetching, comments.length > 0]}>
            <ul className="mb-4">
              {comments.map((comment, index) => {
                const isLastItem = index === comments.length - 1;

                return (
                  <li key={comment.id}>
                    <CommentCard comment={comment} />
                    {!isLastItem && <Hr />}
                  </li>
                );
              })}
            </ul>
            <If condition={hasNextPage}>
              <ButtonGroup alignment="center">
                <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                  Load More
                </Button>
              </ButtonGroup>
            </If>
          </If>
        </If>
      </Drawer.Body>
      <Drawer.Footer>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <FormLayout>
            <FormLayout.Column span={12}>
              <TextInput placeholder="Add a comment..." {...register('content')} />
              <TextInput type="submit" className="hidden" />
            </FormLayout.Column>
          </FormLayout>
        </form>
      </Drawer.Footer>
    </>
  );
};
