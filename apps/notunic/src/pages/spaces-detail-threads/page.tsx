import { useApiNotunicThreadsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, Hr, NoResults, PageContent, PageLoader } from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC } from 'react';
import { useParams } from 'react-router';

import { ThreadCard } from '../../components/thread-card';

interface SpacesDetailThreadsPageProps {
  spaceId: number;
}

const SpacesDetailThreadsPage: FC<SpacesDetailThreadsPageProps> = ({ spaceId }) => {
  const [threads, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiNotunicThreadsInfiniteQuery({
      spaceId: [spaceId],
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

  return (
    <>
      <PageContent>
        <If condition={isInitialFetching}>
          <PageLoader />
        </If>
        <If condition={[!isInitialFetching, !threads.length]}>
          <NoResults
            icon={SearchXIcon}
            title="No threads yet"
            subtitle="There are no threads in this space. Start a new thread to get the conversation going!"
          />
        </If>
        <If condition={[!isInitialFetching, !!threads.length]}>
          <ul>
            {threads.map((thread, index) => {
              const isLast = index === threads.length - 1;
              return (
                <li key={thread.id}>
                  <ThreadCard thread={thread} as="div" />
                  {!isLast && <Hr />}
                </li>
              );
            })}
          </ul>
          {hasNextPage && (
            <ButtonGroup hasMargin alignment="center">
              <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                Load more
              </Button>
            </ButtonGroup>
          )}
        </If>
      </PageContent>
    </>
  );
};

export default function () {
  const { id } = useParams<{ id: string }>();

  return <SpacesDetailThreadsPage spaceId={Number(id)} />;
}
