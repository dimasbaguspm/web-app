import { useApiSpenicleCategoriesInfiniteQuery } from '@dimasbaguspm/hooks/use-api';
import { CategoryGroupModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { useModalRoute } from '@dimasbaguspm/providers/modal-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import { Button, ButtonGroup, ButtonIcon, Heading, Icon, NoResults, PageLoader } from '@dimasbaguspm/versaur';
import { Edit3Icon, TrashIcon, UsersRoundIcon, UserX2Icon } from 'lucide-react';
import { FC } from 'react';

import { CategoryCard } from '../../../components/category-card';
import { DRAWER_ROUTES } from '../../../constants/drawer-routes';
import { MODAL_ROUTES } from '../../../constants/modal-routes';

interface OverviewTabProps {
  categoryGroup: CategoryGroupModel;
}

export const OverviewTab: FC<OverviewTabProps> = ({ categoryGroup }) => {
  const { openDrawer } = useDrawerRoute();
  const { openModal } = useModalRoute();

  const [categories, , { isLoading: isFetchingCategories }] = useApiSpenicleCategoriesInfiniteQuery(
    {
      id: categoryGroup?.memberIds || [],
    },
    {
      enabled: Boolean(categoryGroup?.memberIds.length),
    },
  );
  const handleAddMembersClick = () => {
    openDrawer(DRAWER_ROUTES.ADD_CATEGORY_GROUP_MEMBERS, { categoryGroupId: categoryGroup.id });
  };

  const handleEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_CATEGORY_GROUP, { categoryGroupId: categoryGroup.id });
  };

  const handleDeleteClick = () => {
    openModal(MODAL_ROUTES.DELETE_CATEGORY_GROUP, { categoryGroupId: categoryGroup.id });
  };

  const handleCategoryClick = (categoryId: number) => {
    openDrawer(DRAWER_ROUTES.DETAIL_CATEGORY, { categoryId });
  };

  return (
    <>
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
          <PageLoader />
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
              return (
                <li key={category.id}>
                  <CategoryCard category={category} onClick={() => handleCategoryClick(category.id)} />
                </li>
              );
            })}
          </ul>
        </If>
      </div>
    </>
  );
};
