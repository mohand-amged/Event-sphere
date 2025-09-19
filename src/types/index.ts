export interface User {
  id: string;
  email: string;
  name: string;
  role: 'attendee' | 'organizer' | 'admin';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  price: number;
  currency: string;
  capacity: number;
  availableTickets: number;
  category: string;
  organizer: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  status: 'draft' | 'published' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  event: Event;
  ticketQuantity: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  ticketCode: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking_confirmed' | 'event_reminder' | 'event_cancelled' | 'payment_success' | 'general';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export interface DashboardStats {
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  upcomingEvents: number;
  recentBookings: Booking[];
  popularEvents: Event[];
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
  eventsByCategory: Array<{
    category: string;
    count: number;
  }>;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'attendee' | 'organizer';
}

export interface EventFilters {
  search?: string;
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'date' | 'price' | 'popularity' | 'created';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateEventData {
  title: string;
  description: string;
  image: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  price: number;
  capacity: number;
  category: string;
  tags: string[];
}