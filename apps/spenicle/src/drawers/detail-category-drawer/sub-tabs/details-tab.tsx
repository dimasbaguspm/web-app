import { CategoryModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleCategory } from '@dimasbaguspm/utils/data';
import { If } from '@dimasbaguspm/utils/if';
import {
  AttributeList,
  Badge,
  BadgeGroup,
  Button,
  ButtonGroup,
  Icon,
} from '@dimasbaguspm/versaur';
import { EditIcon } from 'lucide-react';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../../../constants/drawer-routes';

interface DetailsTabProps {
  data: CategoryModel;
}

export const DetailsTab: FC<DetailsTabProps> = ({ data }) => {
  const { openDrawer } = useDrawerRoute();
  const { variant, type, note } = formatSpenicleCategory(data);

  const handleEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_CATEGORY, { categoryId: data.id });
  };

  return (
    <>
      <ButtonGroup className="mb-4">
        <Button variant="outline" onClick={handleEditClick}>
          <Icon as={EditIcon} color="inherit" size="sm" />
          Edit
        </Button>
      </ButtonGroup>

      <BadgeGroup className="mb-4">
        <Badge color={variant}>{type}</Badge>
      </BadgeGroup>

      <AttributeList>
        <If condition={note}>
          <AttributeList.Item title="Notes" span={12}>
            {note}
          </AttributeList.Item>
        </If>
      </AttributeList>
    </>
  );
};
