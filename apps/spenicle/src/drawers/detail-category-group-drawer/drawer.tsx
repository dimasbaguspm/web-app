import { useApiSpenicleCategoriesInfiniteQuery, useApiSpenicleCategoryGroupQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  Avatar,
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  ButtonIcon,
  Card,
  Drawer,
  Heading,
  Icon,
  LoadingIndicator,
  NoResults,
} from '@dimasbaguspm/versaur';
import { Edit3Icon, TrashIcon, UsersRoundIcon, UserX2Icon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../constants/modal-routes';

interface DetailCategoryGroupDrawerProps {
  categoryGroupId: number;
}

export const DetailCategoryGroupDrawer: FC<DetailCategoryGroupDrawerProps> = ({ categoryGroupId }) => {
  const { openDrawer } = useDrawerRoute();
  const { openModal } = useModalRoute();

  const [categoryGroup] = useApiSpenicleCategoryGroupQuery(categoryGroupId, {
    enabled: Boolean(categoryGroupId),
  });

  const [categories, , { isFetching: isFetchingCategories }] = useApiSpenicleCategoriesInfiniteQuery(
    {
      id: categoryGroup?.memberIds || [],
    },
    {
      enabled: Boolean(categoryGroup?.memberIds.length),
    },
  );

  const handleAddMembersClick = () => {
    openDrawer(DRAWER_ROUTES.ADD_CATEGORY_GROUP_MEMBERS, { categoryGroupId });
  };

  const handleEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_CATEGORY_GROUP, { categoryGroupId });
  };

  const handleDeleteClick = () => {
    openModal(MODAL_ROUTES.DELETE_CATEGORY_GROUP, { categoryGroupId });
  };

  const handleCategoryClick = (categoryId: number) => {
    openDrawer(DRAWER_ROUTES.DETAIL_CATEGORY, { categoryId });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>{categoryGroup?.name ?? 'Category Group Details'}</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>
        <ButtonGroup alignment="between" hasMargin>
          <ButtonGroup>
            <Button variant="outline" onClick={handleEditClick}>
              <Icon as={Edit3Icon} color="inherit" size="sm" />
              Edit
            </Button>
            <Button variant="outline" aria-label="Manage Members" onClick={handleAddMembersClick}>
              <Icon as={UsersRoundIcon} color="inherit" size="sm" />
              Manage
            </Button>
          </ButtonGroup>
          <ButtonIcon
            as={TrashIcon}
            variant="danger-outline"
            aria-label="Delete Category Group"
            onClick={handleDeleteClick}
          />
        </ButtonGroup>

        <div>
          <Heading level={3} hasMargin>
            Members
          </Heading>
          <If condition={isFetchingCategories}>
            <LoadingIndicator size="sm" type="bar" />
          </If>
          <If condition={[!isFetchingCategories, !categories.length]}>
            <NoResults
              icon={UserX2Icon}
              title="No members found"
              subtitle="This group doesn't have any members yet. Start adding to manage categories"
              action={
                <ButtonGroup>
                  <Button variant="outline" onClick={handleAddMembersClick}>
                    Add Members
                  </Button>
                </ButtonGroup>
              }
            />
          </If>
          <If condition={[!isFetchingCategories, categories.length]}>
            <ul>
              {categories?.map((category) => {
                const { type, variant, initialName } = formatSpenicleCategory(category);
                return (
                  <li key={category.id}>
                    <Card
                      onClick={() => handleCategoryClick(category.id)}
                      avatar={<Avatar shape="rounded">{initialName}</Avatar>}
                      title={category.name}
                      badge={
                        <BadgeGroup>
                          <Badge color={variant}>{type}</Badge>
                        </BadgeGroup>
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </If>
        </div>
      </Drawer.Body>
    </>
  );
};
