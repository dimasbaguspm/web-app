import { operations } from './generated/spenicle.openapi';

export type SearchAccountsModel = NonNullable<operations['getAccount']['parameters']['query']>;
export type AccountsPageModel = operations['getAccount']['responses']['200']['content']['application/json'];
export type CreateAccountModel = operations['postAccount']['requestBody']['content']['application/json'];
export type UpdateAccountModel = operations['patchAccountById']['requestBody']['content']['application/json'] &
  operations['patchAccountById']['parameters']['path'];
export type AccountModel = operations['getAccountById']['responses']['200']['content']['application/json'];

export type SearchAccountGroupsModel = NonNullable<operations['getAccount-group']['parameters']['query']>;
export type AccountGroupsPageModel = operations['getAccount-group']['responses']['200']['content']['application/json'];
export type CreateAccountGroupModel = operations['postAccount-group']['requestBody']['content']['application/json'];
export type UpdateAccountGroupModel =
  operations['patchAccount-groupById']['requestBody']['content']['application/json'] &
    operations['patchAccount-groupById']['parameters']['path'];
export type AccountGroupModel = operations['getAccount-groupById']['responses']['200']['content']['application/json'];

export type SearchAccountGroupMembersModel = NonNullable<operations['getAccount-group-members']['parameters']['query']>;
export type AccountGroupMembersPageModel =
  operations['getAccount-group-members']['responses']['200']['content']['application/json'];
export type AccountGroupMemberModel = AccountGroupMembersPageModel['items'][number];
export type CreateAccountGroupMembersModel =
  operations['postAccount-group-members']['requestBody']['content']['application/json'];
export type DeleteAccountGroupMemberModel =
  operations['deleteAccount-group-membersByAccountGroupId']['requestBody']['content']['application/json'];

export type SearchCategoriesModel = NonNullable<operations['getCategory']['parameters']['query']>;
export type CategoriesPageModel = operations['getCategory']['responses']['200']['content']['application/json'];
export type CreateCategoryModel = operations['postCategory']['requestBody']['content']['application/json'];
export type UpdateCategoryModel = operations['patchCategoryById']['requestBody']['content']['application/json'] &
  operations['patchCategoryById']['parameters']['path'];
export type CategoryModel = operations['getCategoryById']['responses']['200']['content']['application/json'];

export type SearchCategoryGroupsModel = NonNullable<operations['getCategory-group']['parameters']['query']>;
export type CategoryGroupsPageModel =
  operations['getCategory-group']['responses']['200']['content']['application/json'];
export type CreateCategoryGroupModel = operations['postCategory-group']['requestBody']['content']['application/json'];
export type UpdateCategoryGroupModel =
  operations['patchCategory-groupById']['requestBody']['content']['application/json'] &
    operations['patchCategory-groupById']['parameters']['path'];
export type CategoryGroupModel = operations['getCategory-groupById']['responses']['200']['content']['application/json'];

export type SearchCategoryGroupMembersModel = NonNullable<
  operations['getCategory-group-members']['parameters']['query']
>;
export type CategoryGroupMembersPageModel =
  operations['getCategory-group-members']['responses']['200']['content']['application/json'];
export type CategoryGroupMemberModel = CategoryGroupMembersPageModel['items'][number];
export type CreateCategoryGroupMembersModel =
  operations['postCategory-group-members']['requestBody']['content']['application/json'];
export type DeleteCategoryGroupMemberModel =
  operations['deleteCategory-group-membersByCategoryGroupId']['requestBody']['content']['application/json'] &
    operations['deleteCategory-group-membersByCategoryGroupId']['parameters']['path'];

export type SearchCategoryBudgetModel = NonNullable<operations['getCategory-budget']['parameters']['query']>;
export type CategoryBudgetPageModel =
  operations['getCategory-budget']['responses']['200']['content']['application/json'];
export type CategoryBudgetModel =
  operations['getCategory-budgetById']['responses']['200']['content']['application/json'];
export type CreateCategoryBudgetModel = operations['postCategory-budget']['requestBody']['content']['application/json'];
export type UpdateCategoryBudgetModel =
  operations['patchCategory-budgetById']['requestBody']['content']['application/json'] &
    operations['patchCategory-budgetById']['parameters']['path'];

export type SearchTransactionsModel = NonNullable<operations['getTransaction']['parameters']['query']>;
export type TransactionsPageModel = operations['getTransaction']['responses']['200']['content']['application/json'];
export type CreateTransactionModel = operations['postTransaction']['requestBody']['content']['application/json'];
export type UpdateTransactionModel = operations['patchTransactionById']['requestBody']['content']['application/json'] &
  operations['patchTransactionById']['parameters']['path'];
export type TransactionModel = operations['getTransactionById']['responses']['200']['content']['application/json'];

export type SearchScheduledTransactionsModel = NonNullable<
  operations['getScheduled-transaction']['parameters']['query']
>;
export type ScheduledTransactionsPageModel =
  operations['getScheduled-transaction']['responses']['200']['content']['application/json'];
export type CreateScheduledTransactionModel =
  operations['postScheduled-transaction']['requestBody']['content']['application/json'];
export type UpdateScheduledTransactionModel =
  operations['patchScheduled-transactionById']['requestBody']['content']['application/json'] &
    operations['patchScheduled-transactionById']['parameters']['path'];
export type ScheduledTransactionModel =
  operations['getScheduled-transactionById']['responses']['200']['content']['application/json'];

export type ScheduledTransactionQueuePageModel = NonNullable<
  operations['getScheduled-transactionByIdQueue']['responses']['200']['content']['application/json']
>;
export type ScheduledTransactionQueueModel = ScheduledTransactionQueuePageModel['items'][number];
export type SearchScheduledTransactionQueueModel = NonNullable<
  operations['getScheduled-transactionByIdQueue']['parameters']['query']
>;

export type SearchSummaryTransactionsModel = NonNullable<operations['getSummaryTransactions']['parameters']['query']>;
export type SummaryTransactionsModel =
  operations['getSummaryTransactions']['responses']['200']['content']['application/json'];
export type SearchSummaryAccountsModel = NonNullable<operations['getSummaryAccount']['parameters']['query']>;
export type SummaryAccountsModel = operations['getSummaryAccount']['responses']['200']['content']['application/json'];
export type SearchSummaryCategoriesModel = NonNullable<operations['getSummaryCategory']['parameters']['query']>;
export type SummaryCategoriesModel =
  operations['getSummaryCategory']['responses']['200']['content']['application/json'];
export type SearchSummaryTotalTransactionsModel = NonNullable<operations['getSummaryTotal']['parameters']['query']>;
export type SummaryTotalTransactionsModel =
  operations['getSummaryTotal']['responses']['200']['content']['application/json'];

export type BackupRequestModel =
  operations['getBackup-requestsById']['responses']['200']['content']['application/json'];
export type SearchBackupRequestsModel = NonNullable<operations['getBackup-requests']['parameters']['query']>;
export type BackupRequestsPageModel =
  operations['getBackup-requests']['responses']['200']['content']['application/json'];
export type CreateBackupRequestModel = operations['postBackup-requests']['requestBody']['content']['application/json'];
export type DownloadBackupRequestModel = operations['getBackup-requestsByIdDownload']['parameters']['path'];
export type CreateRestoreBackupRequestModel =
  operations['postBackup-requestsRestore']['requestBody']['content']['application/json'];
export type RestoreBackupRequestModel =
  operations['postBackup-requestsRestore']['responses']['200']['content']['application/json'];

export type ReportRequestsModel = operations['getReportsSettings']['responses']['200']['content']['application/json'];
export type UpdateReportRequestsModel =
  operations['patchReportsSettings']['requestBody']['content']['application/json'];
export type CreateReportGenerateModel = operations['postReportsSettings']['requestBody']['content']['application/json'];
