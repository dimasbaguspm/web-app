import { useApiSpenicleCategoryQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  DescriptionList,
  Drawer,
  Icon,
  LoadingIndicator,
} from '@dimasbaguspm/versaur';
import { EditIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

interface DetailCategoryDrawerProps {
  categoryId: number;
}

export const DetailCategoryDrawer: FC<DetailCategoryDrawerProps> = ({
  categoryId,
}) => {
  const { openDrawer } = useDrawerRoute();
  const [category, , { isLoading }] = useApiSpenicleCategoryQuery(categoryId);

  const handleEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_CATEGORY, { categoryId });
  };

  return (
    <>
      <Drawer.Header>
        <If condition={isLoading}>
          <Drawer.Title>Loading</Drawer.Title>
        </If>
        <If condition={!isLoading}>
          <Drawer.Title>{category?.name}</Drawer.Title>
        </If>

        <Drawer.CloseButton />
      </Drawer.Header>

      <If condition={isLoading}>
        <LoadingIndicator type="bar" size="sm" />
      </If>

      <If condition={[!isLoading, category]}>
        {() => {
          return (
            <Drawer.Body>
              <ButtonGroup className="mb-4">
                <Button variant="outline" onClick={handleEditClick}>
                  <Icon as={EditIcon} color="inherit" size="sm" />
                  Edit
                </Button>
              </ButtonGroup>

              <DescriptionList>
                <If condition={category?.note}>
                  <DescriptionList.Item span={12}>
                    <DescriptionList.Term>Notes</DescriptionList.Term>
                    <DescriptionList.Details>
                      {category?.note || '-'}
                    </DescriptionList.Details>
                  </DescriptionList.Item>
                </If>
              </DescriptionList>
            </Drawer.Body>
          );
        }}
      </If>
    </>
  );
};
