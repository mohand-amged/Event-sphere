import { BookingsList } from '../features/bookings/BookingsList';

export function MyBookingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            Manage your event bookings, view tickets, and track your upcoming events.
          </p>
        </div>
        <BookingsList />
      </div>
    </div>
  );
}
