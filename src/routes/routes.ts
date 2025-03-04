
import { ReactNode } from 'react';

// Define route types
export interface AppRoute {
  path: string;
  element: ReactNode;
  requiresAuth?: boolean;
  roles?: string[];
  children?: AppRoute[];
}

// Import actual route components in App.tsx
