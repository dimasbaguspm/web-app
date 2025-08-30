import { AccountModel } from '@dimasbaguspm/interfaces';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { formatSpenicleAccount } from '@dimasbaguspm/utils/data';
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
  data: AccountModel;
}

export const DetailsTab: FC<DetailsTabProps> = ({ data }) => {
  const { openDrawer } = useDrawerRoute();
  const { type, isExpense, formattedAmount, notes } =
    formatSpenicleAccount(data);

  const handleEditClick = () => {
    openDrawer(DRAWER_ROUTES.EDIT_ACCOUNT, { accountId: data.id });
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
        <Badge color={isExpense ? 'primary' : 'secondary'} size="md">
          {type}
        </Badge>
      </BadgeGroup>

      <AttributeList columns={1}>
        <AttributeList.Item title="Amount">
          {formattedAmount}
        </AttributeList.Item>
        <If condition={notes}>
          <AttributeList.Item title="Notes">{notes}</AttributeList.Item>
        </If>
      </AttributeList>
    </>
  );
};
