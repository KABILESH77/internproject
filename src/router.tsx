/**
 * Router Configuration
 * Maps page types to URL paths for route-based navigation
 */

import { createBrowserRouter, RouteObject } from 'react-router-dom';
import App from './App';
import { AuthCallback } from './components/auth/AuthCallback';

// Route configuration mapping page IDs to paths
export const ROUTES = {
  home: '/',
  search: '/search',
  recommendations: '/for-you',
  saved: '/saved',
  help: '/help',
  admin: '/admin',
  profile: '/profile',
  auth: '/auth',
  authCallback: '/auth/callback',
} as const;

// Reverse mapping: path -> pageId
export const PATH_TO_PAGE: Record<string, keyof typeof ROUTES> = Object.entries(ROUTES).reduce(
  (acc, [key, path]) => {
    acc[path] = key as keyof typeof ROUTES;
    return acc;
  },
  {} as Record<string, keyof typeof ROUTES>
);

// Type for page routes
export type PageType = keyof typeof ROUTES;

// Get path from page type
export function getPathForPage(page: PageType): string {
  return ROUTES[page];
}

// Get page type from path
export function getPageFromPath(path: string): PageType {
  return PATH_TO_PAGE[path] || 'home';
}

// Route definitions - all routes render the App component
// The App component handles which page to show based on current URL
const routes: RouteObject[] = [
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '*',
    element: <App />,
  },
];

export const router = createBrowserRouter(routes);
