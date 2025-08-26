import { useApiSpenicleAccountsPaginatedQuery } from '@dimasbaguspm/hooks/use-api';
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
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
import { debounce } from 'lodash';
import { SearchXIcon } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

interface SelectAccountDrawerProps {
  returnToDrawer: string;
  returnToDrawerId?: Record<string, string> | null;
  payload: Record<string, unknown>;
  payloadId: string;
}

export const SelectAccountDrawer: FC<SelectAccountDrawerProps> = ({
  returnToDrawer,
  returnToDrawerId = null,
  payloadId,
  payload,
}) => {
  const { isDesktop } = useWindowResize();
  const { openDrawer } = useDrawerRoute();
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null,
  );
  const [searchValue, setSearchValue] = useState('');

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setSearchValue(value), 1000),
    [],
  );

  const [accounts, , { isFetching }] = useApiSpenicleAccountsPaginatedQuery({
    search: searchValue,
  });

  const handleOnSubmit = () => {
    openDrawer(returnToDrawer, returnToDrawerId, {
      replace: true,
      state: {
        payload: {
          ...payload,
          [payloadId]: selectedAccountId,
        },
      },
    });
  };

  const handleOnCancel = () => {
    openDrawer(returnToDrawer, returnToDrawerId, {
      replace: true,
      state: {
        payload,
      },
    });
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Select Account</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <FormLayout className="mb-4">
          <FormLayout.Column span={12}>
            <SearchInput
              defaultValue={searchValue}
              onChange={(e) => debouncedSetSearch(e.target.value)}
            />
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
        <ButtonGroup alignment="end" fluid={!isDesktop}>
          <Button variant="ghost" onClick={handleOnCancel}>
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
