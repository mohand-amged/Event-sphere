import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookingCard } from './BookingCard';
import { bookingsApi, authApi } from '../../services/api';
import { queryKeys } from '../../lib/react-query';
import { Loader2, Ticket, Calendar, Filter, AlertCircle } from 'lucide-react';

type BookingFilter = 'all' | 'upcoming' | 'past' | 'cancelled';

export function BookingsList() {
  const [filter, setFilter] = useState<BookingFilter>('all');
  const currentUser = authApi.getCurrentUser();

  const { data: bookingsResponse, isLoading, error } = useQuery({
    queryKey: queryKeys.bookings(currentUser?.id),
    queryFn: () => bookingsApi.getUserBookings(currentUser?.id),
    enabled: !!currentUser,
  });

  const bookings = bookingsResponse?.data || [];

  // Filter bookings based on selected filter
  const filteredBookings = bookings.filter(booking => {
    const eventDate = new Date(booking.event.date);
    const now = new Date();

    switch (filter) {
      case 'upcoming':
        return eventDate > now && booking.status !== 'cancelled';
      case 'past':
        return eventDate <= now && booking.status !== 'cancelled';
      case 'cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">
            We couldn't load your bookings. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getFilterCount = (filterType: BookingFilter) => {
    return bookings.filter(booking => {
      const eventDate = new Date(booking.event.date);
      const now = new Date();

      switch (filterType) {
        case 'upcoming':
          return eventDate > now && booking.status !== 'cancelled';
        case 'past':
          return eventDate <= now && booking.status !== 'cancelled';
        case 'cancelled':
          return booking.status === 'cancelled';
        default:
          return true;
      }
    }).length;
  };

  return (
    <div>
      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Bookings
          </h2>
          <div className="text-sm text-gray-500">
            {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all' as BookingFilter, label: 'All Bookings' },
            { key: 'upcoming' as BookingFilter, label: 'Upcoming' },
            { key: 'past' as BookingFilter, label: 'Past Events' },
            { key: 'cancelled' as BookingFilter, label: 'Cancelled' },
          ].map(({ key, label }) => {
            const count = getFilterCount(key);
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16">
          <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {filter === 'all'
              ? "You haven't booked any events yet. Discover amazing events and book your first experience!"
              : `You don't have any ${filter} bookings at the moment.`}
          </p>
          {filter === 'all' && (
            <a
              href="/events"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Explore Events
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {bookings.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {bookings.length}
              </div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getFilterCount('upcoming')}
              </div>
              <div className="text-sm text-gray-600">Upcoming Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {getFilterCount('past')}
              </div>
              <div className="text-sm text-gray-600">Past Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                ${bookings.reduce((total, booking) => total + booking.totalAmount, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}