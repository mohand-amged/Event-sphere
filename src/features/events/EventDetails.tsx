import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Share2, 
  Heart, 
  ArrowLeft,
  User,
  Ticket
} from 'lucide-react';
import { eventsApi, bookingsApi, authApi } from '../../services/api';
import { queryKeys } from '../../lib/react-query';
import { format } from 'date-fns';

export function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  
  const currentUser = authApi.getCurrentUser();

  const { data: eventResponse, isLoading, error } = useQuery({
    queryKey: queryKeys.event(id!),
    queryFn: () => eventsApi.getEvent(id!),
    enabled: !!id,
  });

  const bookingMutation = useMutation({
    mutationFn: ({ eventId, quantity }: { eventId: string; quantity: number }) =>
      bookingsApi.createBooking(eventId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.event(id!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings() });
      setIsBooking(false);
      alert('Booking successful! Check your bookings page for details.');
    },
    onError: (error: any) => {
      setIsBooking(false);
      alert(error.message || 'Booking failed. Please try again.');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error || !eventResponse?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Event not found</h2>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
          <Link
            to="/events"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to events
          </Link>
        </div>
      </div>
    );
  }

  const event = eventResponse.data;
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const isSoldOut = event.availableTickets === 0;
  const totalPrice = event.price * ticketQuantity;

  const handleBooking = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (ticketQuantity > event.availableTickets) {
      alert(`Only ${event.availableTickets} tickets available`);
      return;
    }

    setIsBooking(true);
    bookingMutation.mutate({ eventId: event.id, quantity: ticketQuantity });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative h-96 rounded-xl overflow-hidden mb-8">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {event.category}
                </span>
              </div>
              {event.price === 0 && (
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Free
                  </span>
                </div>
              )}
            </div>

            {/* Event Info */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {event.title}
                  </h1>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-red-500 border border-gray-300 rounded-lg">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 border border-gray-300 rounded-lg">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-sm text-gray-600">
                        {format(eventDate, 'EEEE, MMMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {event.startTime} - {event.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-gray-600">{event.location}</p>
                      <p className="text-sm text-gray-600">{event.address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-sm text-gray-600">
                        {event.availableTickets} of {event.capacity} available
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <User className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium">Organizer</p>
                      <div className="flex items-center mt-1">
                        {event.organizer.avatar ? (
                          <img
                            src={event.organizer.avatar}
                            alt={event.organizer.name}
                            className="w-6 h-6 rounded-full object-cover mr-2"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <span className="text-xs font-medium text-gray-500">
                              {event.organizer.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="text-sm text-gray-600">{event.organizer.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="font-medium text-gray-700 mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-lg sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {event.price === 0 ? 'Free' : `$${event.price}`}
                  {event.price > 0 && <span className="text-sm text-gray-500 font-normal"> / ticket</span>}
                </div>
                {!isUpcoming && (
                  <p className="text-red-600 font-medium">This event has ended</p>
                )}
                {isSoldOut && isUpcoming && (
                  <p className="text-red-600 font-medium">Sold Out</p>
                )}
              </div>

              {isUpcoming && !isSoldOut && (
                <div className="space-y-4">
                  {/* Ticket Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Tickets
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{ticketQuantity}</span>
                      <button
                        onClick={() => setTicketQuantity(Math.min(event.availableTickets, ticketQuantity + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Max {Math.min(10, event.availableTickets)} per order
                    </p>
                  </div>

                  {/* Total Price */}
                  {event.price > 0 && (
                    <div className="flex justify-between items-center py-3 border-t border-gray-200">
                      <span className="font-medium">Total</span>
                      <span className="text-xl font-bold text-blue-600">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Book Button */}
                  <button
                    onClick={handleBooking}
                    disabled={isBooking || bookingMutation.isPending}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isBooking || bookingMutation.isPending ? (
                      'Processing...'
                    ) : (
                      <>
                        <Ticket className="h-4 w-4 mr-2" />
                        {event.price === 0 ? 'Get Free Tickets' : 'Book Now'}
                      </>
                    )}
                  </button>

                  {!currentUser && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      You'll be redirected to login before booking
                    </p>
                  )}
                </div>
              )}

              {/* Event Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available Tickets</span>
                  <span className="font-medium">{event.availableTickets}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Capacity</span>
                  <span className="font-medium">{event.capacity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Event Status</span>
                  <span className={`font-medium capitalize ${
                    event.status === 'published' ? 'text-green-600' : 
                    event.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}