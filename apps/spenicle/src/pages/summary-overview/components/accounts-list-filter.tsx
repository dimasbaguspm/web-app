import { useApiSpenicleAccountsPaginatedQuery } from '@dimasbaguspm/hooks/use-api';
import { AccountModel } from '@dimasbaguspm/interfaces';
import { Button, Heading, SelectableMultipleInput, Text } from '@dimasbaguspm/versaur';
import { useMemo } from 'react';

import { AccountCard } from '../../../components/account-card';

interface AccountsListFilterProps {
  selectedAccountIds: number[];
  onAccountsChange: (accountIds: number[]) => void;
}

export const AccountsListFilter = ({ selectedAccountIds, onAccountsChange }: AccountsListFilterProps) => {
  const [accountsData] = useApiSpenicleAccountsPaginatedQuery({
    pageSize: 100,
  });

  const groupedAccounts = useMemo(() => {
    if (!accountsData?.items) return { expense: [], income: [] };

    const expense: AccountModel[] = [];
    const income: AccountModel[] = [];

    accountsData.items.forEach((account) => {
      if (account.type === 'expense') {
        expense.push(account);
      } else if (account.type === 'income') {
        income.push(account);
      }
    });

    return { expense, income };
  }, [accountsData]);

  const renderAccountGroup = (title: string, accounts: AccountModel[]) => {
    if (accounts.length === 0) return null;

    return (
      <div className="mb-6">
        <Heading as="h6" color="ghost">
          {title}
        </Heading>
        <ul>
          {accounts.map((account) => (
            <li key={account.id}>
              <SelectableMultipleInput
                checked={selectedAccountIds.includes(account.id)}
                value={account.id.toString()}
                onChange={(e) => {
                  if (e.target.checked) {
                    onAccountsChange([...selectedAccountIds, account.id]);
                  } else {
                    onAccountsChange(selectedAccountIds.filter((id) => id !== account.id));
                  }
                }}
              >
                <AccountCard as="div" size="none" account={account} supplementaryInfo="" hideAmount hideType />
              </SelectableMultipleInput>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4">
        <Heading as="h5" color="neutral">
          Filter Accounts
        </Heading>
        <Text as="small" color="gray">
          Select one or more accounts
        </Text>
      </div>

      <div className="space-y-4">
        {renderAccountGroup('Expense', groupedAccounts.expense)}
        {renderAccountGroup('Income', groupedAccounts.income)}
      </div>

      {selectedAccountIds.length > 0 && (
        <Button onClick={() => onAccountsChange([])} variant="ghost">
          Clear all filters
        </Button>
      )}
    </div>
  );
};
