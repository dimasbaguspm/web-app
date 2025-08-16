# Marketplace Module

This module provides a comprehensive marketplace interface for managing and discovering applications.

## Architecture

The marketplace module is organized with clear separation of concerns:

### 📁 Structure

```
marketplace/
├── page.tsx                 # Main page component and provider setup
├── types.ts                 # TypeScript interfaces and types
├── context/                 # Context management
│   ├── context.ts          # Context definition and hook
│   ├── provider.tsx        # Context provider component
│   └── index.ts           # Context exports
├── hooks/                  # Custom hooks
│   ├── use-marketplace-data.ts  # Main data fetching and processing hook
│   └── index.ts           # Hook exports
└── presentation/           # UI components
    ├── app-card.tsx       # Individual app card component
    ├── apps-grid.tsx      # Grid layout for apps
    ├── available-apps-section.tsx    # Available apps section
    ├── empty-state.tsx    # Empty state component
    ├── installed-apps-section.tsx   # Installed apps section
    ├── marketplace-header.tsx       # Page header
    ├── marketplace-loading.tsx      # Loading state
    ├── section-header.tsx # Section header component
    └── index.ts          # Presentation exports
```

### 🔧 Components Responsibilities

#### Context Layer

- **MarketplaceContext**: Provides marketplace data and actions throughout the component tree
- **MarketplaceProvider**: Wraps the marketplace page with context
- **useMarketplaceContext**: Hook for accessing marketplace context

#### Data Layer

- **useMarketplaceData**: Main hook that fetches and processes all marketplace data
  - Fetches apps, app profiles, and group data
  - Creates optimized data maps for quick lookups
  - Categorizes apps by user/group installations
  - Provides action handlers for app interactions

#### Presentation Layer

- **MarketplaceHeader**: Page title and description
- **InstalledAppsSection**: Shows user's installed apps (personal + group)
- **AvailableAppsSection**: Shows apps available for installation
- **AppCard**: Individual app display with actions
- **AppsGrid**: Responsive grid layout for apps
- **SectionHeader**: Reusable section headers with badges
- **EmptyState**: Consistent empty state messaging
- **MarketplaceLoading**: Loading indicator component

### 🎯 Key Features

1. **Smart Data Management**
   - Efficient data fetching with proper loading states
   - Memoized computations for performance
   - Categorizes apps by personal vs group installations

2. **Responsive Design**
   - Mobile-first responsive grid layout
   - Consistent spacing with Tailwind 4
   - Proper component composition

3. **Clear User Experience**
   - Visual distinction between personal and group apps
   - Proper loading and empty states
   - Action buttons for opening and installing apps

4. **Type Safety**
   - Complete TypeScript interfaces
   - Proper component prop types
   - Context type safety

### 🔌 Usage

```tsx
import MarketplacePage from './pages/marketplace/page';

// The page is fully self-contained and manages its own state
<MarketplacePage />;
```

### 🚀 Future Enhancements

- App installation functionality
- Search and filtering capabilities
- App categories and tags
- User reviews and ratings
- Bulk operations for apps
