import { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * Lazy-load a React component and normalize module shapes.
 * Accepts import functions that either return a module with a default export
 * or that directly return the component.
 *
 * Example:
 *   const MyComp = lazyLoad(() => import('./MyComp'))
 */
export const lazyLoad = <T extends ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T } | T>,
): LazyExoticComponent<T> => {
  return lazy(async () => {
    const mod = await importFunc();
    // If module already has a default export, return it. Otherwise wrap the
    // component as the default export which is what React.lazy expects.
    if (typeof mod === 'object' && mod !== null && 'default' in mod) {
      return mod as { default: T };
    }
    return { default: mod as T };
  });
};
