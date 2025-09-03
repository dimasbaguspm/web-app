import {
  useApiSpenicleCategoryGroupsInfiniteQuery,
  useApiSpenicleDeleteCategoryGroup,
  useApiSpenicleCategoriesInfiniteQuery,
} from '@dimasbaguspm/hooks/use-api';
import { CategoryGroupModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Button, Heading, Icon, LoadingIndicator, SearchInput, Text, useSnackbars } from '@dimasbaguspm/versaur';
import { PlusIcon, SettingsIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

import { CategoryGroupCard } from './components';

const SettingsCategoryGroupPage = () => {
  const { openDrawer } = useDrawerRoute();
  const { showSnack } = useSnackbars();

  const [categoryGroupSearch, setCategoryGroupSearch] = useState('');

  const [categoryGroups, , { isPending: isLoadingCategoryGroups }] = useApiSpenicleCategoryGroupsInfiniteQuery({
    search: categoryGroupSearch,
    pageSize: 20,
  });
  const [categories] = useApiSpenicleCategoriesInfiniteQuery({ pageSize: 200 });

  const [deleteCategoryGroup] = useApiSpenicleDeleteCategoryGroup();

  const categoryGroupMemberCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    categories.forEach((category) => {
      if (category.categoryGroupId) {
        counts[category.categoryGroupId] = (counts[category.categoryGroupId] || 0) + 1;
      }
    });
    return counts;
  }, [categories]);

  const handleNewCategoryGroup = () => {
    openDrawer(DRAWER_ROUTES.NEW_CATEGORY_GROUP);
  };

  const handleDeleteCategoryGroup = async (categoryGroup: CategoryGroupModel) => {
    if (categoryGroupMemberCounts[categoryGroup.id] > 0) {
      showSnack('warning', 'Cannot delete group with existing members. Remove all categories first.');
      return;
    }

    if (confirm(`Are you sure you want to delete "${categoryGroup.name}"?`)) {
      try {
        await deleteCategoryGroup({ id: categoryGroup.id });
        showSnack('success', 'Category group deleted successfully');
      } catch {
        showSnack('danger', 'Failed to delete category group');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon as={SettingsIcon} size="lg" color="secondary" />
          <div>
            <Heading level={2} className="text-xl font-semibold">
              Category Groups
            </Heading>
            <Text color="gray" fontSize="sm">
              Organize your categories into logical groups
            </Text>
          </div>
        </div>
        <Text fontSize="sm" color="gray" className="bg-gray-100 px-3 py-1 rounded-full">
          {categoryGroups.length} {categoryGroups.length === 1 ? 'group' : 'groups'}
        </Text>
      </div>

      <SearchInput
        placeholder="Search category groups..."
        value={categoryGroupSearch}
        onChange={(e) => setCategoryGroupSearch(e.target.value)}
      />

      <div className="space-y-4">
        {isLoadingCategoryGroups ? (
          <div className="flex justify-center py-12">
            <LoadingIndicator size="lg" />
          </div>
        ) : categoryGroups.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <Icon as={SettingsIcon} size="xl" color="gray" className="mx-auto" />
            <div>
              <Text fontSize="lg" fontWeight="medium" color="gray">
                No category groups found
              </Text>
              <Text fontSize="sm" color="gray">
                {categoryGroupSearch
                  ? 'Try adjusting your search terms'
                  : 'Create your first category group to organize your categories'}
              </Text>
            </div>
            {!categoryGroupSearch && (
              <Button onClick={handleNewCategoryGroup}>
                <Icon as={PlusIcon} size="sm" color="inherit" />
                Create Category Group
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {categoryGroups.map((categoryGroup) => (
              <CategoryGroupCard
                key={categoryGroup.id}
                categoryGroup={categoryGroup}
                categoryCount={categoryGroupMemberCounts[categoryGroup.id] || 0}
                onDelete={handleDeleteCategoryGroup}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsCategoryGroupPage;
