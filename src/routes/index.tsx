import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Pages
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { EventsListPage } from '../pages/EventsListPage';
import { EventDetailsPage } from '../pages/EventDetailsPage';
import { CreateEventPage } from '../pages/CreateEventPage';
import { EditEventPage } from '../pages/EditEventPage';
import { MyBookingsPage } from '../pages/MyBookingsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { OrganizerDashboardPage } from '../pages/OrganizerDashboardPage';
import { ManageEventsPage } from '../pages/ManageEventsPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'events',
        element: <EventsListPage />,
      },
      {
        path: 'events/:id',
        element: <EventDetailsPage />,
      },
      {
        path: 'my-bookings',
        element: (
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/organizer',
    element: (
      <ProtectedRoute requiredRole="organizer">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <OrganizerDashboardPage />,
      },
      {
        path: 'events',
        element: <ManageEventsPage />,
      },
      {
        path: 'events/create',
        element: <CreateEventPage />,
      },
      {
        path: 'events/:id/edit',
        element: <EditEventPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: 'users',
        element: <AdminUsersPage />,
      },
      {
        path: 'events',
        element: <ManageEventsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);