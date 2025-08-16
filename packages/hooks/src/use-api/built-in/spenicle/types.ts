import { operations } from '../../types/spenicle.openapi';

export type SearchAccountsModel =
  operations['getAccount']['parameters']['query'];
export type AccountsPageModel =
  operations['getAccount']['responses']['200']['content']['application/json'];
export type CreateAccountModel =
  operations['postAccount']['requestBody']['content']['application/json'];
export type UpdateAccountModel =
  operations['patchAccountById']['requestBody']['content']['application/json'] &
    operations['patchAccountById']['parameters']['path'];
export type AccountModel =
  operations['getAccountById']['responses']['200']['content']['application/json'];

export type SearchCategoriesModel =
  operations['getCategory']['parameters']['query'];
export type CategoriesPageModel =
  operations['getCategory']['responses']['200']['content']['application/json'];
export type CreateCategoryModel =
  operations['postCategory']['requestBody']['content']['application/json'];
export type UpdateCategoryModel =
  operations['patchCategoryById']['requestBody']['content']['application/json'] &
    operations['patchCategoryById']['parameters']['path'];
export type CategoryModel =
  operations['getCategoryById']['responses']['200']['content']['application/json'];

export type SearchTransactionsModel =
  operations['getTransaction']['parameters']['query'];
export type TransactionsPageModel =
  operations['getTransaction']['responses']['200']['content']['application/json'];
export type CreateTransactionModel =
  operations['postTransaction']['requestBody']['content']['application/json'];
export type UpdateTransactionModel =
  operations['patchTransactionById']['requestBody']['content']['application/json'] &
    operations['patchTransactionById']['parameters']['path'];
export type TransactionModel =
  operations['getTransactionById']['responses']['200']['content']['application/json'];

export type SearchSummaryModel =
  operations['getSummary']['parameters']['query'];
export type SummaryModel =
  operations['getSummary']['responses']['200']['content']['application/json'];
