import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  User, 
  Calendar, 
  Ticket, 
  Settings, 
  Edit3, 
  Mail, 
  MapPin,
  Clock,
  Star,
  Badge,
  Camera
} from 'lucide-react';
import { authApi, bookingsApi, eventsApi } from '../../services/api';
import { queryKeys } from '../../lib/react-query';
import { EventCard } from '../events/EventCard';
import { BookingCard } from '../bookings/BookingCard';
import { format } from 'date-fns';

export function UserProfile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'settings'>('overview');
  const currentUser = authApi.getCurrentUser();

  const { data: bookingsResponse } = useQuery({
    queryKey: queryKeys.bookings(currentUser?.id),
    queryFn: () => bookingsApi.getUserBookings(currentUser?.id),
    enabled: !!currentUser,
  });

  const bookings = bookingsResponse?.data || [];
  const upcomingBookings = bookings.filter(booking => {
    const eventDate = new Date(booking.event.date);
    return eventDate > new Date() && booking.status === 'confirmed';
  }).slice(0, 3);

  const profileStats = {
    totalBookings: bookings.length,
    upcomingEvents: upcomingBookings.length,
    totalSpent: bookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
    memberSince: currentUser?.createdAt ? new Date(currentUser.createdAt).getFullYear() : new Date().getFullYear(),
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentUser.role === 'organizer' ? 'bg-purple-100 text-purple-800' :
                  currentUser.role === 'admin' ? 'bg-red-100 text-red-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                </span>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <Mail className="w-4 h-4 mr-2" />
                <span>{currentUser.email}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{profileStats.totalBookings}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{profileStats.upcomingEvents}</div>
                  <div className="text-sm text-gray-600">Upcoming Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">${profileStats.totalSpent.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{profileStats.memberSince}</div>
                  <div className="text-sm text-gray-600">Member Since</div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview', icon: User },
                { key: 'bookings', label: 'My Bookings', icon: Ticket },
                { key: 'settings', label: 'Settings', icon: Settings },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Upcoming Events */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Upcoming Events
                  </h3>
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{booking.event.title}</h4>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{format(new Date(booking.event.date), 'MMM dd, yyyy')} at {booking.event.startTime}</span>
                                <MapPin className="w-4 h-4 ml-3 mr-1" />
                                <span>{booking.event.location}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">{booking.ticketQuantity} ticket(s)</div>
                              <div className="font-medium">{booking.totalAmount === 0 ? 'Free' : `$${booking.totalAmount.toFixed(2)}`}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h4>
                      <p className="text-gray-600 mb-4">Discover amazing events happening near you!</p>
                      <a
                        href="/events"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Browse Events
                      </a>
                    </div>
                  )}
                </div>

                {/* Activity Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Activity Summary
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <Badge className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Favorite Category</div>
                        <div className="font-medium">
                          {bookings.length > 0 ? 'Technology' : 'None yet'}
                        </div>
                      </div>
                      <div className="text-center">
                        <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Last Booking</div>
                        <div className="font-medium">
                          {bookings.length > 0 
                            ? format(new Date(bookings[0].bookingDate), 'MMM dd, yyyy')
                            : 'No bookings yet'
                          }
                        </div>
                      </div>
                      <div className="text-center">
                        <Ticket className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Events This Month</div>
                        <div className="font-medium">
                          {bookings.filter(booking => {
                            const eventDate = new Date(booking.event.date);
                            const now = new Date();
                            return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                          }).length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Ticket className="w-5 h-5 mr-2" />
                  Recent Bookings
                </h3>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                    {bookings.length > 5 && (
                      <div className="text-center">
                        <a
                          href="/my-bookings"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View All Bookings →
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h4>
                    <p className="text-gray-600 mb-4">Start booking events to see them here!</p>
                    <a
                      href="/events"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Explore Events
                    </a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Account Settings
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={currentUser.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={currentUser.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                      <input
                        type="text"
                        value={currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        disabled
                      />
                    </div>
                    <div className="pt-4">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-3">
                        Update Profile
                      </button>
                      <button className="text-red-600 hover:text-red-800 font-medium">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Privacy Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="ml-3 text-sm text-gray-700">Send me email notifications about my bookings</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="ml-3 text-sm text-gray-700">Send me marketing emails about new events</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-3 text-sm text-gray-700">Make my profile public</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}