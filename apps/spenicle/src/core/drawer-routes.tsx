/* eslint-disable import/max-dependencies */
import { useWindowResize } from '@dimasbaguspm/hooks/use-window-resize';
import { useDrawerRoute } from '@dimasbaguspm/providers/drawer-route-provider';
import { Drawer } from '@dimasbaguspm/versaur';
import { FC } from 'react';

import { DRAWER_ROUTES } from '../constants/drawer-routes';
import { AddAccountGroupMemberDrawer } from '../drawers/add-account-group-member-drawer/drawer';
import { AddCategoryGroupMemberDrawer } from '../drawers/add-category-group-member-drawer/drawer';
import { DetailAccountDrawer } from '../drawers/detail-account-drawer/drawer';
import { DetailAccountGroupDrawer } from '../drawers/detail-account-group-drawer/drawer';
import { DetailCategoryDrawer } from '../drawers/detail-category-drawer/drawer';
import { DetailCategoryGroupDrawer } from '../drawers/detail-category-group-drawer/drawer';
import { DetailScheduledPaymentsDrawer } from '../drawers/detail-scheduled-payments-drawer';
import { DetailTransactionDrawer } from '../drawers/detail-transaction-drawer/drawer';
import { EditAccountDrawer } from '../drawers/edit-account-drawer/drawer';
import { EditAccountGroupDrawer } from '../drawers/edit-account-group-drawer/drawer';
import { EditCategoryBudgetDrawer } from '../drawers/edit-category-budget-drawer/drawer';
import { EditCategoryDrawer } from '../drawers/edit-category-drawer/drawer';
import { EditCategoryGroupDrawer } from '../drawers/edit-category-group-drawer/drawer';
import { EditScheduledPaymentsDrawer } from '../drawers/edit-scheduled-payments-drawer/drawer';
import { EditTransactionDrawer } from '../drawers/edit-transaction-drawer/drawer';
import { FilterAccountDrawer } from '../drawers/filter-account-drawer/drawer';
import { FilterCategoryDrawer } from '../drawers/filter-category-drawer/drawer';
import { FilterSummaryDrawer } from '../drawers/filter-summary-drawer/drawer';
import { FilterTransactionDrawer } from '../drawers/filter-transaction-drawer/drawer';
import { NewAccountDrawer } from '../drawers/new-account-drawer/drawer';
import { NewAccountGroupDrawer } from '../drawers/new-account-group-drawer/drawer';
import { NewBackupRequestDrawer } from '../drawers/new-backup-request-drawer/drawer';
import { NewCategoryBudgetDrawer } from '../drawers/new-category-budget-drawer/drawer';
import { NewCategoryDrawer } from '../drawers/new-category-drawer/drawer';
import { NewCategoryGroupDrawer } from '../drawers/new-category-group-drawer/drawer';
import { NewRestoreBackupRequestDrawer } from '../drawers/new-restore-backup-request-drawer/drawer';
import { NewScheduledPaymentsDrawer } from '../drawers/new-scheduled-payments-drawer/drawer';
import { NewTransactionDrawer } from '../drawers/new-transaction-drawer/drawer';
import { SelectAccountDrawer } from '../drawers/select-account-drawer/drawer';
import { SelectCategoryDrawer } from '../drawers/select-category-drawer/drawer';
import { SelectMultipleAccountDrawer } from '../drawers/select-multiple-account-drawer/drawer';
import { SelectMultipleCategoryDrawer } from '../drawers/select-multiple-category-drawer/drawer';
import { TimelineTransactionsDrawer } from '../drawers/timeline-transactions-drawer/drawer';

interface DrawerParams {
  appId?: string;
  accountId?: number;
  categoryId?: number;
  transactionId?: number;
  accountGroupId?: number;
  categoryGroupId?: number;
  categoryBudgetId?: number;
  scheduledTransactionId?: number;
  payloadId?: string;
  startDate?: string;
  endDate?: string;
  tabId?: string;
}

interface DrawerState {
  payload?: Record<string, string>;
  returnToDrawer?: string;
  returnToDrawerId?: Record<string, string> | null;
}

export const DrawerRoutes: FC = () => {
  const { isDesktop } = useWindowResize();
  const { isOpen, drawerId, params, state, closeDrawer } = useDrawerRoute<DrawerParams, DrawerState>();

  const is = (id: string) => drawerId === id;
  const hasParam = (param: keyof typeof params) => (params && typeof params === 'object' ? param in params : false);
  const hasState = (stateKey: keyof typeof state) => (state && typeof state === 'object' ? stateKey in state : false);

  const disableInteractive = (
    [
      DRAWER_ROUTES.SELECT_ACCOUNT,
      DRAWER_ROUTES.SELECT_CATEGORY,
      DRAWER_ROUTES.SELECT_MULTIPLE_ACCOUNT,
      DRAWER_ROUTES.SELECT_MULTIPLE_CATEGORY,
    ] as string[]
  ).includes(drawerId ?? '');

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeDrawer}
      size={isDesktop ? 'lg' : 'full'}
      transitionType={isDesktop ? 'slide' : 'fade'}
      disableOverlayClickToClose={disableInteractive}
      disableEscapeKeyDown={disableInteractive}
    >
      {is(DRAWER_ROUTES.NEW_ACCOUNT) && <NewAccountDrawer />}
      {is(DRAWER_ROUTES.ACCOUNT_DETAIL) && hasParam('accountId') && (
        <DetailAccountDrawer accountId={params.accountId!} tabId={params.tabId!} />
      )}
      {is(DRAWER_ROUTES.EDIT_ACCOUNT) && hasParam('accountId') && <EditAccountDrawer accountId={params.accountId!} />}
      {is(DRAWER_ROUTES.NEW_CATEGORY) && <NewCategoryDrawer />}
      {is(DRAWER_ROUTES.DETAIL_CATEGORY) && hasParam('categoryId') && (
        <DetailCategoryDrawer categoryId={params.categoryId!} tabId={params.tabId!} />
      )}
      {is(DRAWER_ROUTES.EDIT_CATEGORY) && hasParam('categoryId') && (
        <EditCategoryDrawer categoryId={params.categoryId!} />
      )}
      {is(DRAWER_ROUTES.NEW_TRANSACTION) && <NewTransactionDrawer payload={state?.payload} />}
      {is(DRAWER_ROUTES.DETAIL_TRANSACTION) && hasParam('transactionId') && (
        <DetailTransactionDrawer transactionId={params.transactionId!} />
      )}
      {is(DRAWER_ROUTES.EDIT_TRANSACTION) && hasParam('transactionId') && (
        <EditTransactionDrawer transactionId={params.transactionId!} payload={state?.payload} />
      )}
      {is(DRAWER_ROUTES.FILTER_TRANSACTION) && <FilterTransactionDrawer payload={state?.payload} />}
      {is(DRAWER_ROUTES.SELECT_ACCOUNT) &&
        hasState('payload') &&
        hasState('returnToDrawer') &&
        hasParam('payloadId') && (
          <SelectAccountDrawer
            payloadId={params.payloadId!}
            payload={state.payload!}
            returnToDrawer={state.returnToDrawer!}
            returnToDrawerId={state.returnToDrawerId!}
          />
        )}
      {is(DRAWER_ROUTES.SELECT_MULTIPLE_ACCOUNT) &&
        hasState('payload') &&
        hasState('returnToDrawer') &&
        hasParam('payloadId') && (
          <SelectMultipleAccountDrawer
            payloadId={params.payloadId!}
            payload={state.payload!}
            returnToDrawer={state.returnToDrawer!}
            returnToDrawerId={state.returnToDrawerId!}
          />
        )}
      {is(DRAWER_ROUTES.SELECT_CATEGORY) &&
        hasState('payload') &&
        hasState('returnToDrawer') &&
        hasParam('payloadId') && (
          <SelectCategoryDrawer
            payloadId={params.payloadId!}
            payload={state.payload!}
            returnToDrawer={state.returnToDrawer!}
            returnToDrawerId={state.returnToDrawerId!}
          />
        )}
      {is(DRAWER_ROUTES.SELECT_MULTIPLE_CATEGORY) &&
        hasState('payload') &&
        hasState('returnToDrawer') &&
        hasParam('payloadId') && (
          <SelectMultipleCategoryDrawer
            payloadId={params.payloadId!}
            payload={state.payload!}
            returnToDrawer={state.returnToDrawer!}
            returnToDrawerId={state.returnToDrawerId!}
          />
        )}
      {is(DRAWER_ROUTES.FILTER_SUMMARY) && <FilterSummaryDrawer payload={state?.payload} />}
      {is(DRAWER_ROUTES.FILTER_CATEGORY) && <FilterCategoryDrawer />}
      {is(DRAWER_ROUTES.FILTER_ACCOUNT) && <FilterAccountDrawer />}
      {is(DRAWER_ROUTES.NEW_ACCOUNT_GROUP) && <NewAccountGroupDrawer />}
      {is(DRAWER_ROUTES.DETAIL_ACCOUNT_GROUP) && hasParam('accountGroupId') && (
        <DetailAccountGroupDrawer accountGroupId={params.accountGroupId!} tabId={params?.tabId} />
      )}
      {is(DRAWER_ROUTES.EDIT_ACCOUNT_GROUP) && hasParam('accountGroupId') && (
        <EditAccountGroupDrawer accountGroupId={params.accountGroupId!} />
      )}
      {is(DRAWER_ROUTES.ADD_ACCOUNT_GROUP_MEMBERS) && hasParam('accountGroupId') && (
        <AddAccountGroupMemberDrawer accountGroupId={params.accountGroupId!} />
      )}

      {is(DRAWER_ROUTES.NEW_CATEGORY_GROUP) && <NewCategoryGroupDrawer />}
      {is(DRAWER_ROUTES.DETAIL_CATEGORY_GROUP) && hasParam('categoryGroupId') && (
        <DetailCategoryGroupDrawer categoryGroupId={params.categoryGroupId!} tabId={params?.tabId} />
      )}
      {is(DRAWER_ROUTES.EDIT_CATEGORY_GROUP) && hasParam('categoryGroupId') && (
        <EditCategoryGroupDrawer categoryGroupId={params.categoryGroupId!} />
      )}
      {is(DRAWER_ROUTES.ADD_CATEGORY_GROUP_MEMBERS) && hasParam('categoryGroupId') && (
        <AddCategoryGroupMemberDrawer categoryGroupId={params.categoryGroupId!} />
      )}

      {is(DRAWER_ROUTES.DETAIL_SCHEDULED_PAYMENTS) && hasParam('scheduledTransactionId') && (
        <DetailScheduledPaymentsDrawer scheduledTransactionId={params.scheduledTransactionId!} />
      )}
      {is(DRAWER_ROUTES.NEW_SCHEDULED_PAYMENTS) && <NewScheduledPaymentsDrawer payload={state?.payload} />}
      {is(DRAWER_ROUTES.EDIT_SCHEDULED_PAYMENTS) && hasParam('scheduledTransactionId') && (
        <EditScheduledPaymentsDrawer scheduledTransactionId={params.scheduledTransactionId!} payload={state?.payload} />
      )}
      {is(DRAWER_ROUTES.NEW_BACKUP_REQUEST) && <NewBackupRequestDrawer />}
      {is(DRAWER_ROUTES.RESTORE_BACKUP_REQUEST) && <NewRestoreBackupRequestDrawer />}
      {is(DRAWER_ROUTES.NEW_CATEGORY_BUDGET) && hasParam('categoryId') && (
        <NewCategoryBudgetDrawer categoryId={params.categoryId!} />
      )}
      {is(DRAWER_ROUTES.EDIT_CATEGORY_BUDGET) && hasParam('categoryId') && hasParam('categoryBudgetId') && (
        <EditCategoryBudgetDrawer categoryId={params.categoryId!} categoryBudgetId={params.categoryBudgetId!} />
      )}
      {is(DRAWER_ROUTES.TIMELINE_TRANSACTIONS) && hasParam('startDate') && hasParam('endDate') && (
        <TimelineTransactionsDrawer startDate={params.startDate!} endDate={params.endDate!} />
      )}
    </Drawer>
  );
};
