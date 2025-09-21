import { operations } from './generated/notunic.openapi';

/**
 * 
 export type SearchAccountsModel = NonNullable<operations['getAccount']['parameters']['query']>;
 export type AccountsPageModel = operations['getAccount']['responses']['200']['content']['application/json'];
 export type CreateAccountModel = operations['postAccount']['requestBody']['content']['application/json'];
 export type UpdateAccountModel = operations['patchAccountById']['requestBody']['content']['application/json'] &
   operations['patchAccountById']['parameters']['path'];
 export type AccountModel = operations['getAccountById']['responses']['200']['content']['application/json'];
 */
export type SearchSpacesModel = NonNullable<operations['getSpaces']['parameters']['query']>;
export type SpacesPageModel = operations['getSpaces']['responses']['200']['content']['application/json'];
export type CreateSpaceModel = operations['postSpaces']['requestBody']['content']['application/json'];
export type UpdateSpaceModel = operations['patchSpacesById']['requestBody']['content']['application/json'] &
  operations['patchSpacesById']['parameters']['path'];
export type SpaceModel = operations['getSpacesById']['responses']['200']['content']['application/json'];

export type SearchThreadsModel = NonNullable<operations['getThreads']['parameters']['query']>;
export type ThreadsPageModel = operations['getThreads']['responses']['200']['content']['application/json'];
export type CreateThreadModel = operations['postThreads']['requestBody']['content']['application/json'];
export type UpdateThreadModel = operations['patchThreadsById']['requestBody']['content']['application/json'] &
  operations['patchThreadsById']['parameters']['path'];
export type ThreadModel = operations['getThreadsById']['responses']['200']['content']['application/json'];

export type SearchCommentsModel = NonNullable<operations['getComments']['parameters']['query']>;
export type CommentsPageModel = operations['getComments']['responses']['200']['content']['application/json'];
export type CreateCommentModel = operations['postComments']['requestBody']['content']['application/json'];
export type UpdateCommentModel = operations['patchCommentsById']['requestBody']['content']['application/json'] &
  operations['patchCommentsById']['parameters']['path'];
export type CommentModel = operations['getCommentsById']['responses']['200']['content']['application/json'];

export type SearchActionsModel = NonNullable<operations['getActions']['parameters']['query']>;
export type ActionsPageModel = operations['getActions']['responses']['200']['content']['application/json'];
export type CreateActionModel = operations['postActions']['requestBody']['content']['application/json'];
export type UpdateActionModel = operations['patchActionsById']['requestBody']['content']['application/json'] &
  operations['patchActionsById']['parameters']['path'];
export type ActionModel = operations['getActionsById']['responses']['200']['content']['application/json'];

export type CreateActionLinkModel = operations['postAction-links']['requestBody']['content']['application/json'];
export type UpdateActionLinkModel = operations['patchAction-linksById']['requestBody']['content']['application/json'] &
  operations['patchAction-linksById']['parameters']['path'];
export type ActionLinkModel = operations['getAction-linksById']['responses']['200']['content']['application/json'];
