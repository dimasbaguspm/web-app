import { useApiSpenicleAccountsPaginatedQuery } from '@dimasbaguspm/hooks/use-api';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { If } from '@dimasbaguspm/utils/if';
import {
  Button,
  ButtonGroup,
  Drawer,
  FormLayout,
  LoadingIndicator,
  NoResults,
  SearchInput,
  SelectableSingleInput,
} from '@dimasbaguspm/versaur';
import { SearchXIcon } from 'lucide-react';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';

import { DRAWER_ROUTES } from '../../constants/drawer-routes';

interface SelectAccountDrawerProps {
  payload: Record<string, unknown>;
}

export const SelectAccountDrawer: FC<SelectAccountDrawerProps> = ({
  payload,
}) => {
  const { closeDrawer, openDrawer } = useDrawerRoute();
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null,
  );

  const { register, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      search: '',
    },
  });

  const [accounts, , { isFetching }] = useApiSpenicleAccountsPaginatedQuery({
    name: [watch('search')],
  });

  const handleOnSubmit = () => {
    openDrawer(DRAWER_ROUTES.NEW_TRANSACTION, null, {
      replace: true,
      state: {
        payload: {
          ...payload,
          accountId: selectedAccountId,
        },
      },
    });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Select Account</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>

      <Drawer.Body>
        <FormLayout className="mb-4">
          <FormLayout.Column span={12}>
            <SearchInput {...register('search')} />
          </FormLayout.Column>
        </FormLayout>

        <If condition={[isFetching]}>
          <LoadingIndicator size="sm" type="bar" />
        </If>

        <If condition={[accounts?.items.length, !isFetching]}>
          <ul>
            {accounts?.items.map((account) => (
              <li key={account.id}>
                <SelectableSingleInput
                  label={<span>{account.name}</span>}
                  value={account.id.toString()}
                  checked={account.id === selectedAccountId}
                  onChange={() => setSelectedAccountId(account.id)}
                />
              </li>
            ))}
          </ul>
        </If>

        <If condition={[!accounts?.items.length, !isFetching]}>
          <NoResults
            icon={SearchXIcon}
            title="No accounts found"
            subtitle="Try adjusting your search criteria, or create a new account."
          />
        </If>
      </Drawer.Body>

      <Drawer.Footer>
        <ButtonGroup alignment="end">
          <Button variant="ghost" onClick={closeDrawer}>
            Cancel
          </Button>
          <Button
            form="select-account-form"
            onClick={handleOnSubmit}
            disabled={!selectedAccountId}
          >
            Save
          </Button>
        </ButtonGroup>
      </Drawer.Footer>
    </>
  );
};
