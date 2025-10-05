import { operations } from './generated/notunic.openapi';

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

export type SearchThreadGroupsModel = NonNullable<operations['getThread-group']['parameters']['query']>;
export type ThreadGroupsPageModel = operations['getThread-group']['responses']['200']['content']['application/json'];
export type CreateThreadGroupModel = operations['postThread-group']['requestBody']['content']['application/json'];
export type UpdateThreadGroupModel = operations['patchThread-groupById']['requestBody']['content']['application/json'] &
  operations['patchThread-groupById']['parameters']['path'];
export type ThreadGroupModel = operations['getThread-groupById']['responses']['200']['content']['application/json'];

export type SearchThreadGroupTagsModel = NonNullable<operations['getThread-group-tag']['parameters']['query']>;
export type ThreadGroupTagsPageModel =
  operations['getThread-group-tag']['responses']['200']['content']['application/json'];
export type CreateThreadGroupTagModel =
  operations['postThread-group-tag']['requestBody']['content']['application/json'];
export type UpdateThreadGroupTagModel =
  operations['patchThread-group-tagById']['requestBody']['content']['application/json'] &
    operations['patchThread-group-tagById']['parameters']['path'];
export type ThreadGroupTagModel =
  operations['getThread-group-tagById']['responses']['200']['content']['application/json'];

export type SearchCommentsModel = NonNullable<operations['getComments']['parameters']['query']>;
export type CommentsPageModel = operations['getComments']['responses']['200']['content']['application/json'];
export type CreateCommentModel = operations['postComments']['requestBody']['content']['application/json'];
export type UpdateCommentModel = operations['patchCommentsById']['requestBody']['content']['application/json'] &
  operations['patchCommentsById']['parameters']['path'];
export type CommentModel = operations['getCommentsById']['responses']['200']['content']['application/json'];

export type SearchCommentActionsModel = NonNullable<operations['getComment-actions']['parameters']['query']>;
export type CommentActionsPageModel =
  operations['getComment-actions']['responses']['200']['content']['application/json'];
export type CreateCommentActionModel = operations['postComment-actions']['requestBody']['content']['application/json'];
export type UpdateCommentActionModel =
  operations['patchComment-actionsById']['requestBody']['content']['application/json'] &
    operations['patchComment-actionsById']['parameters']['path'];
export type CommentActionModel =
  operations['getComment-actionsById']['responses']['200']['content']['application/json'];

export type SearchCommentCategoriesModel = NonNullable<operations['getComment-category']['parameters']['query']>;
export type CommentCategoriesPageModel =
  operations['getComment-category']['responses']['200']['content']['application/json'];
export type CreateCommentCategoryModel =
  operations['postComment-category']['requestBody']['content']['application/json'];
export type UpdateCommentCategoryModel =
  operations['patchComment-categoryById']['requestBody']['content']['application/json'] &
    operations['patchComment-categoryById']['parameters']['path'];
export type CommentCategoryModel =
  operations['getComment-categoryById']['responses']['200']['content']['application/json'];

export type SearchCommentCategoryMembersModel = NonNullable<
  operations['getComment-category-members']['parameters']['query']
>;
export type CommentCategoryMembersPageModel =
  operations['getComment-category-members']['responses']['200']['content']['application/json'];
export type CreateCommentCategoryMemberModel =
  operations['postComment-category-members']['requestBody']['content']['application/json'];
export type CommentCategoryMemberModel = CommentCategoryMembersPageModel['items'][number];

export type SearchThreadCategoriesModel = NonNullable<operations['getThread-category']['parameters']['query']>;
export type ThreadCategoriesPageModel =
  operations['getThread-category']['responses']['200']['content']['application/json'];
export type CreateThreadCategoryModel = operations['postThread-category']['requestBody']['content']['application/json'];
export type UpdateThreadCategoryModel =
  operations['patchThread-categoryById']['requestBody']['content']['application/json'] &
    operations['patchThread-categoryById']['parameters']['path'];
export type ThreadCategoryModel =
  operations['getThread-categoryById']['responses']['200']['content']['application/json'];
export type UpdateThreadCategoryMemberModel = operations['putThread-categoryByIdMembers']['parameters']['path'] &
  operations['putThread-categoryByIdMembers']['requestBody']['content']['application/json'];

export type SearchThreadCategoryMembersModel = NonNullable<
  operations['getThread-category-members']['parameters']['query']
>;
export type ThreadCategoryMembersPageModel =
  operations['getThread-category-members']['responses']['200']['content']['application/json'];
export type CreateThreadCategoryMemberModel =
  operations['postThread-category-members']['requestBody']['content']['application/json'];
export type ThreadCategoryMemberModel = ThreadCategoryMembersPageModel['items'][number];
