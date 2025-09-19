import { EventsList } from '../features/events/EventsList';

export function EventsListPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Events</h1>
          <p className="text-gray-600">
            Find amazing events happening near you or explore new experiences around the world.
          </p>
        </div>
        <EventsList />
      </div>
    </div>
  );
}
