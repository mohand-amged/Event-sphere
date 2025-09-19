import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  Clock,
  User,
  QrCode,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import type { Booking } from '../../types';
import { bookingsApi } from '../../services/api';
import { queryKeys } from '../../lib/react-query';
import { format } from 'date-fns';

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const queryClient = useQueryClient();
  
  const cancelMutation = useMutation({
    mutationFn: () => bookingsApi.cancelBooking(booking.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings() });
      setShowCancelConfirm(false);
    },
  });

  const event = booking.event;
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const isPast = eventDate < new Date();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="md:flex">
        {/* Event Image */}
        <div className="md:w-48 h-48 md:h-auto">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                  <Link to={`/events/${event.id}`}>
                    {event.title}
                  </Link>
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
                {booking.paymentStatus && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                    {booking.paymentStatus}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{format(eventDate, 'MMM dd, yyyy')} at {event.startTime}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Ticket className="h-4 w-4 mr-2" />
                  <span>{booking.ticketQuantity} ticket{booking.ticketQuantity > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Booked {format(new Date(booking.bookingDate), 'MMM dd, yyyy')}</span>
                </div>
              </div>

              {/* Ticket Code */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <QrCode className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-mono text-gray-700">{booking.ticketCode}</span>
                <button
                  className="ml-auto text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => navigator.clipboard.writeText(booking.ticketCode)}
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="text-right ml-4">
              <div className="text-lg font-bold text-gray-900">
                {booking.totalAmount === 0 ? 'Free' : `$${booking.totalAmount.toFixed(2)}`}
              </div>
              <div className="text-sm text-gray-500">
                {booking.ticketQuantity > 1 && booking.totalAmount > 0 && (
                  <span>${(booking.totalAmount / booking.ticketQuantity).toFixed(2)} each</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <Link
                to={`/events/${event.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Event
              </Link>
              
              {booking.status === 'confirmed' && booking.paymentStatus === 'paid' && (
                <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Download Ticket
                </button>
              )}
            </div>

            {/* Cancel Button */}
            {booking.status === 'confirmed' && isUpcoming && !showCancelConfirm && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel Booking
              </button>
            )}

            {/* Cancel Confirmation */}
            {showCancelConfirm && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 flex items-center mr-2">
                  <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                  Cancel booking?
                </span>
                <button
                  onClick={() => cancelMutation.mutate()}
                  disabled={cancelMutation.isPending}
                  className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
                >
                  {cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-400"
                >
                  Keep
                </button>
              </div>
            )}

            {/* Status Messages */}
            {isPast && (
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Event completed
              </span>
            )}

            {booking.status === 'cancelled' && (
              <span className="text-sm text-red-600 flex items-center">
                <X className="h-4 w-4 mr-1" />
                Cancelled
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}