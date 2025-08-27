import { useState } from 'react';

export const useSortOrder = () => {
  return useState<'asc' | 'desc'>('desc');
};
