import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Star } from 'lucide-react';
import type { Event } from '../../types';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  showOrganizer?: boolean;
}

export function EventCard({ event, showOrganizer = true }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const isSoldOut = event.availableTickets === 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {event.category}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          {event.price === 0 ? (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Free
            </span>
          ) : (
            <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium shadow">
              ${event.price}
            </span>
          )}
        </div>

        {/* Status Badges */}
        <div className="absolute bottom-4 left-4">
          {isSoldOut && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Sold Out
            </span>
          )}
          {!isUpcoming && !isSoldOut && (
            <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Past Event
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
          <Link to={`/events/${event.id}`}>
            {event.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 text-sm">
          {event.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {format(eventDate, 'MMM dd, yyyy')} at {event.startTime}
            </span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {event.availableTickets > 0 
                ? `${event.availableTickets} tickets available`
                : 'Sold out'
              }
            </span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {event.startTime} - {event.endTime}
            </span>
          </div>
        </div>

        {/* Organizer Info */}
        {showOrganizer && (
          <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center">
              {event.organizer.avatar ? (
                <img
                  src={event.organizer.avatar}
                  alt={event.organizer.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xs font-medium">
                    {event.organizer.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {event.organizer.name}
                </p>
                <p className="text-xs text-gray-500">Organizer</p>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="text-gray-400 text-xs py-1">
                +{event.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">
            {event.price === 0 ? 'Free' : `$${event.price}`}
          </div>
          <Link
            to={`/events/${event.id}`}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isSoldOut || !isUpcoming
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSoldOut ? 'Sold Out' : !isUpcoming ? 'Past Event' : 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  );
}