import { AuthMeModel } from '@dimasbaguspm/interfaces';

import { QUERY_KEYS } from '../../query-keys';
import { HI_URL } from '../../url';
import { useApiQuery } from '../../use-api-query';

export const useApiHiAuthMeQuery = () => {
  return useApiQuery<AuthMeModel, unknown>({
    queryKey: QUERY_KEYS.HI_AUTH_ME,
    base: 'HI',
    path: HI_URL.AUTH.ME,
  });
};
