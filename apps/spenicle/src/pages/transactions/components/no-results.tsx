import { Button, ButtonGroup, Icon, NoResults as VersaurNoResults } from '@dimasbaguspm/versaur';
import { PlusIcon, SearchXIcon } from 'lucide-react';
import { FC } from 'react';

interface NoResultsProps {
  onNewTransactionClick: () => void;
}

export const NoResults: FC<NoResultsProps> = ({ onNewTransactionClick }) => {
  return (
    <VersaurNoResults
      icon={SearchXIcon}
      title="No transactions found"
      subtitle="Create your first transaction by clicking the button below"
      action={
        <ButtonGroup>
          <Button onClick={onNewTransactionClick} variant="outline">
            <Icon as={PlusIcon} color="inherit" />
            New Transaction
          </Button>
        </ButtonGroup>
      }
    />
  );
};
