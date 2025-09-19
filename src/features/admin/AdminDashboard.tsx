import { useQuery } from '@tanstack/react-query';
import { 
  Users,
  Calendar,
  DollarSign,
  Shield,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { dashboardApi, usersApi, authApi } from '../../services/api';
import { queryKeys } from '../../lib/react-query';
import { DashboardHeader } from '../../components/DashboardHeader';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const currentUser = authApi.getCurrentUser();
  
  const { data: statsResponse, isLoading } = useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: () => dashboardApi.getStats(),
    enabled: !!currentUser && currentUser.role === 'admin',
  });

  const { data: usersResponse } = useQuery({
    queryKey: queryKeys.users,
    queryFn: () => usersApi.getUsers(),
    enabled: !!currentUser && currentUser.role === 'admin',
  });

  const stats = statsResponse?.data;
  const users = usersResponse?.data || [];

  const colors = {
    primary: '#dc2626',
    success: '#059669',
    warning: '#d97706',
    info: '#2563eb'
  };

  if (isLoading) {
    return (
      <div>
        <DashboardHeader />
        <div className="p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div>
        <DashboardHeader />
        <div className="p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
            <p className="text-gray-600">System data is not available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate user stats
  const userStats = {
    totalUsers: users.length,
    organizers: users.filter(u => u.role === 'organizer').length,
    attendees: users.filter(u => u.role === 'attendee').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  return (
    <div>
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="System overview and management"
        action={{
          label: 'Manage Users',
          href: '/admin/users',
          icon: Users
        }}
      />
      
      <div className="p-6">
        {/* System Health Alert */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">System Status: Healthy</h3>
              <p className="text-sm text-green-700 mt-1">All services are running normally</p>
            </div>
          </div>
        </div>

        {/* Admin Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{userStats.totalUsers}</p>
                <p className="text-sm text-green-600 flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  {userStats.attendees} attendees
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Users className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
                <p className="text-sm text-blue-600 flex items-center mt-2">
                  <Shield className="w-4 h-4 mr-1" />
                  System managed
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  All time
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Organizers</p>
                <p className="text-3xl font-bold text-gray-900">{userStats.organizers}</p>
                <p className="text-sm text-purple-600 flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Active creators
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Platform Growth */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Platform Growth</h3>
              <div className="text-sm text-gray-500">Revenue & Bookings</div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'revenue' ? `$${value.toLocaleString()}` : `${value} bookings`,
                      name === 'revenue' ? 'Revenue' : 'Bookings'
                    ]}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke={colors.primary} 
                    strokeWidth={3}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="bookings" 
                    stroke={colors.info} 
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Activity</h3>
              <div className="text-sm text-gray-500">Events Created</div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [`${Math.floor(Number(value) / 10)} events`, 'Events Created']}
                  />
                  <Bar 
                    dataKey="bookings" 
                    fill={colors.success}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Management */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <Link to="/admin/users" className="text-red-600 hover:text-red-800 text-sm font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Attendees</p>
                    <p className="text-xs text-gray-500">Regular users</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{userStats.attendees}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Organizers</p>
                    <p className="text-xs text-gray-500">Event creators</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{userStats.organizers}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <Shield className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Administrators</p>
                    <p className="text-xs text-gray-500">System admins</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-900">{userStats.admins}</span>
              </div>
            </div>
          </div>

          {/* Event Oversight */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Event Oversight</h3>
              <Link to="/admin/events" className="text-red-600 hover:text-red-800 text-sm font-medium">
                Manage
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm">Published Events</span>
                </div>
                <span className="font-medium">{stats.totalEvents}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm">Active Bookings</span>
                </div>
                <span className="font-medium">{stats.totalBookings}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-sm">Pending Review</span>
                </div>
                <span className="font-medium">0</span>
              </div>
            </div>
          </div>

          {/* System Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                to="/admin/users"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Manage Users
              </Link>
              <Link 
                to="/admin/events"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Review Events
              </Link>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                System Settings
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}