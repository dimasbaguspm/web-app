import { SearchCategoriesModel } from '@dimasbaguspm/interfaces';

export interface FilterCategoryFormSchema {
  search?: NonNullable<SearchCategoriesModel>['search'];
  type?: NonNullable<SearchCategoriesModel>['type'];
}
