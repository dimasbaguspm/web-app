# useFilters Hook Examples

The `useFilters` hook now supports multiple adapters for different use cases.

## 1. URL Adapter (Default)

Perfect for pages where you want filters to be bookmarkable and shareable via URL.

```typescript
interface MyFilters {
  category: string;
  tags: string[];
  minPrice: number;
}

// Default behavior - uses URL search parameters
const filters = useFilters<MyFilters>();

// With custom replace option
const filters = useFilters<MyFilters>({ replace: false });
```

## 2. State Adapter

Perfect for modals, drawers, or temporary filtering that shouldn't affect the URL.

```typescript
interface DrawerFilters {
  status: string;
  department: string[];
}

// Uses in-memory state instead of URL
const filters = useFilters<DrawerFilters>({ adapter: 'state' });
```

## 3. Custom Adapter

For advanced use cases like localStorage persistence or custom state management.

```typescript
// Custom localStorage adapter
const createLocalStorageAdapter = (key: string): FilterAdapter => {
  return {
    getParams: () => {
      const stored = localStorage.getItem(key);
      return new URLSearchParams(stored || '');
    },
    setParams: (params) => {
      localStorage.setItem(key, params.toString());
      // Trigger re-render somehow (you'd need additional state management)
    },
  };
};

const filters = useFilters<MyFilters>({
  customAdapter: createLocalStorageAdapter('my-filters'),
});
```

## Migration Guide

Existing code using `useFilters` will continue to work without changes:

```typescript
// Before (still works)
const filters = useFilters<MyFilters>();

// After - same behavior, more explicit
const filters = useFilters<MyFilters>({ adapter: 'url' });
```

## Use Cases

### URL Adapter

- Product listing pages
- Search results
- Dashboard views
- Any page where filters should be bookmarkable

### State Adapter

- Filter drawers/modals
- Temporary filtering
- Multi-step forms
- Component-level filtering

### Custom Adapter

- Persistent user preferences
- Cross-session filter storage
- Integration with external state management
- Special synchronization requirements
