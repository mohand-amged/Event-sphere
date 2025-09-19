import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  Ticket,
  Shield,
  Bell,
  LogOut
} from 'lucide-react';
import { authApi } from '../services/api';

export function DashboardSidebar() {
  const location = useLocation();
  const currentUser = authApi.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  const isOrganizer = currentUser?.role === 'organizer' || currentUser?.role === 'admin';

  const menuItems = [
    {
      label: 'Dashboard',
      icon: Home,
      href: isAdmin ? '/admin' : '/organizer',
      active: location.pathname === (isAdmin ? '/admin' : '/organizer')
    },
    {
      label: 'Events',
      icon: Calendar,
      href: isAdmin ? '/admin/events' : '/organizer/events',
      active: location.pathname.includes('/events')
    },
    ...(isAdmin ? [
      {
        label: 'Users',
        icon: Users,
        href: '/admin/users',
        active: location.pathname.includes('/users')
      }
    ] : []),
    {
      label: 'Analytics',
      icon: BarChart3,
      href: '#',
      active: false
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '#',
      active: false
    }
  ];

  const quickActions = isOrganizer ? [
    {
      label: 'Create Event',
      icon: Plus,
      href: '/organizer/events/create',
      primary: true
    },
    {
      label: 'View Bookings',
      icon: Ticket,
      href: '#',
      primary: false
    }
  ] : [];

  const handleLogout = () => {
    authApi.logout();
    window.location.href = '/';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          <div>
            <div className="text-xl font-bold text-gray-900">EventSphere</div>
            <div className="text-xs text-gray-500">
              {isAdmin ? 'Admin Panel' : 'Organizer Dashboard'}
            </div>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {currentUser?.name?.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentUser?.name}
            </p>
            <div className="flex items-center space-x-1">
              {isAdmin && <Shield className="w-3 h-3 text-red-500" />}
              <p className="text-xs text-gray-500 capitalize">
                {currentUser?.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  action.primary
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <action.icon className="w-4 h-4 mr-3" />
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Navigation
        </h3>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Link
            to="/"
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4 mr-3" />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
