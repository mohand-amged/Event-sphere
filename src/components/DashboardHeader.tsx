import { useState } from 'react';
import { Bell, Search, Plus, Filter } from 'lucide-react';
import { authApi } from '../services/api';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

export function DashboardHeader({ title, subtitle, action }: DashboardHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const currentUser = authApi.getCurrentUser();

  const defaultTitle = currentUser?.role === 'admin' ? 'Admin Dashboard' : 'Organizer Dashboard';
  const defaultSubtitle = currentUser?.role === 'admin' 
    ? 'Manage users, events, and system settings'
    : 'Manage your events and track performance';

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {title || defaultTitle}
          </h1>
          {(subtitle || defaultSubtitle) && (
            <p className="text-gray-600 mt-1">
              {subtitle || defaultSubtitle}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Search - Hidden on mobile */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-400 hover:text-gray-600 relative"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No notifications yet
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          {action && (
            <a
              href={action.href}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              {action.icon && <action.icon className="w-4 h-4" />}
              <span>{action.label}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
