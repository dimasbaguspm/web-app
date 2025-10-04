import { HI_QUERY_KEYS } from './query-keys/hi';
import { NOTUNIC_QUERY_KEYS } from './query-keys/notunic';
import { SPENICLE_QUERY_KEYS } from './query-keys/spenicle';

export const QUERY_KEYS = {
  ...HI_QUERY_KEYS,
  ...SPENICLE_QUERY_KEYS,
  ...NOTUNIC_QUERY_KEYS,
};
