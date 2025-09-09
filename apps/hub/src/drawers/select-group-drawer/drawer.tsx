import { useApiHiGroupsInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useAuthProvider } from '@dimasbaguspm/providers/auth-provider';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatHiGroup } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Avatar,
  Button,
  ButtonGroup,
  ButtonIcon,
  Card,
  Drawer,
  NoResults,
  PageLoader,
  SelectableSingleInput,
} from '@dimasbaguspm/versaur';
import { SearchXIcon, XIcon } from 'lucide-react';
import { FC, useState } from 'react';

interface SelectGroupDrawerProps {
  returnToDrawer: string;
  returnToDrawerPayload?: Record<string, string> | null;
  payload: Record<string, unknown>;
  payloadId: string;
}

export const SelectGroupDrawer: FC<SelectGroupDrawerProps> = ({
  returnToDrawer,
  returnToDrawerPayload = null,
  payloadId,
  payload,
}) => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();
  const { user } = useAuthProvider();

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(
    typeof payload?.[payloadId] === 'number' ? payload[payloadId] : null,
  );

  const [groups, , { isInitialFetching, isFetchingNextPage, hasNextPage }, { fetchNextPage }] =
    useApiHiGroupsInfiniteQuery({
      memberIds: [user.id],
      sortBy: 'name',
      sortOrder: 'asc',
      pageSize: 15,
    });

  const handleOnSubmit = () => {
    openDrawer(returnToDrawer, returnToDrawerPayload, {
      replace: true,
      state: {
        payload: {
          ...payload,
          [payloadId]: selectedGroupId,
        },
      },
    });
  };

  const handleOnCancel = () => {
    openDrawer(returnToDrawer, returnToDrawerPayload, {
      replace: true,
      state: {
        payload,
      },
    });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Select Group</Drawer.Title>
        <ButtonIcon as={XIcon} size="sm" variant="ghost" aria-label="Close" onClick={handleOnCancel} />
      </Drawer.Header>

      <Drawer.Body>
        <If condition={[isInitialFetching]}>
          <PageLoader />
        </If>

        <If condition={[groups?.length, !isInitialFetching]}>
          <ul className="mb-4">
            {groups?.map((group) => {
              const { initialName, name, createdDateTime } = formatHiGroup(group);
              return (
                <li key={group.id}>
                  <SelectableSingleInput
                    label={
                      <Card
                        as="div"
                        size="none"
                        avatar={<Avatar size="lg">{initialName}</Avatar>}
                        title={name}
                        supplementaryInfo={createdDateTime}
                      />
                    }
                    value={group.id.toString()}
                    checked={group.id === selectedGroupId}
                    onChange={() => setSelectedGroupId(group.id)}
                  />
                </li>
              );
            })}
          </ul>
          <If condition={hasNextPage}>
            <ButtonGroup alignment="center">
              <Button onClick={() => fetchNextPage()} variant="outline" disabled={isFetchingNextPage}>
                Load More
              </Button>
            </ButtonGroup>
          </If>
        </If>

        <If condition={[!groups?.length, !isInitialFetching]}>
          <NoResults
            icon={SearchXIcon}
            title="No groups found"
            subtitle="Try adjusting your search criteria, or create a new account"
            action={
              <ButtonGroup>
                <Button variant="outline">Create Group</Button>
              </ButtonGroup>
            }
          />
        </If>
      </Drawer.Body>

      <Drawer.Footer>
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={handleOnCancel}>
            Cancel
          </Button>
          <Button onClick={handleOnSubmit} disabled={!selectedGroupId}>
            Select
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
