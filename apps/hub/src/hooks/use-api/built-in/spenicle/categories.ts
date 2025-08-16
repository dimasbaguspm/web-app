import { QUERY_KEYS } from '../../query-keys';
import { SPENICLE_URL } from '../../url';
import { useApiMutate } from '../../use-api-mutate';
import { useApiQuery } from '../../use-api-query';

import {
  SearchCategoriesModel,
  CategoriesPageModel,
  CategoryModel,
  CreateCategoryModel,
  UpdateCategoryModel,
} from './types';

export const useApiSpenicleCategoriesPaginatedQuery = (
  params: SearchCategoriesModel,
) => {
  return useApiQuery<CategoriesPageModel, SearchCategoriesModel>({
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_CATEGORY_PAGINATED(params),
    path: SPENICLE_URL.CATEGORY.PAGINATED,
  });
};

export const useApiSpenicleCategoryQuery = (id: number) => {
  return useApiQuery<CategoryModel, unknown>({
    base: 'SPENICLE',
    queryKey: QUERY_KEYS.SPENICLE_CATEGORY_BY_ID(id),
    path: SPENICLE_URL.CATEGORY.BY_ID(id),
  });
};

export const useApiSpenicleCreateCategory = () => {
  return useApiMutate<CategoryModel, CreateCategoryModel>({
    path: '/category',
    method: 'POST',
    base: 'SPENICLE',
  });
};

export const useApiSpenicleUpdateCategory = () => {
  return useApiMutate<CategoryModel, UpdateCategoryModel>({
    path: '/category/:id',
    method: 'PATCH',
    base: 'SPENICLE',
  });
};
