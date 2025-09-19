import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EventCard } from './EventCard';
import { EventFilters } from './EventFilters';
import { eventsApi } from '../../services/api';
import { queryKeys } from '../../lib/react-query';
import type { EventFilters as EventFiltersType } from '../../types';
import { Loader2, Calendar, AlertCircle } from 'lucide-react';

export function EventsList() {
  const [filters, setFilters] = useState<EventFiltersType>({});

  const { data: eventsResponse, isLoading, error } = useQuery({
    queryKey: queryKeys.events(filters),
    queryFn: () => eventsApi.getEvents(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const events = eventsResponse?.data || [];
  const hasFiltersApplied = Object.keys(filters).length > 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">
            We couldn't load the events. Please try again later.
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

  return (
    <div>
      {/* Filters */}
      <EventFilters filters={filters} onFiltersChange={setFilters} />

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {hasFiltersApplied ? 'Search Results' : 'All Events'}
          </h2>
          <p className="text-gray-600 mt-1">
            {events.length === 0 
              ? 'No events found'
              : `${events.length} event${events.length === 1 ? '' : 's'} found`
            }
            {filters.search && (
              <span className="ml-1">
                for "{filters.search}"
              </span>
            )}
          </p>
        </div>

        {/* Quick Filters */}
        <div className="hidden md:flex items-center space-x-2">
          <span className="text-sm text-gray-500">Quick filters:</span>
          <button
            onClick={() => setFilters({ ...filters, priceMin: 0, priceMax: 0 })}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filters.priceMin === 0 && filters.priceMax === 0
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Free Events
          </button>
          <button
            onClick={() => setFilters({ ...filters, category: 'Technology' })}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filters.category === 'Technology'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tech
          </button>
          <button
            onClick={() => setFilters({ ...filters, category: 'Music' })}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filters.category === 'Music'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Music
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No events found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {hasFiltersApplied 
              ? "Try adjusting your search criteria or removing some filters to see more events."
              : "There are no events available at the moment. Check back later for new events!"
            }
          </p>
          {hasFiltersApplied && (
            <button
              onClick={() => setFilters({})}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Load More / Pagination could go here */}
      {events.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Showing {events.length} events
            {eventsResponse?.pagination && (
              <span> (Page {eventsResponse.pagination.page} of {eventsResponse.pagination.pages})</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}