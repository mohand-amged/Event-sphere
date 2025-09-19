import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

// Query keys for consistent caching
export const queryKeys = {
  auth: ['auth'],
  user: (id?: string) => ['user', id],
  events: (filters?: any) => ['events', filters],
  event: (id: string) => ['event', id],
  bookings: (userId?: string) => ['bookings', userId],
  booking: (id: string) => ['booking', id],
  notifications: (userId?: string) => ['notifications', userId],
  dashboardStats: ['dashboard', 'stats'],
  users: ['users'],
} as const;