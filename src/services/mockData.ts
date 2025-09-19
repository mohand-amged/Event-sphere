import type { User, Event, Booking, Notification, DashboardStats } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'attendee',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'organizer',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c76e?w=400&h=400&fit=crop&crop=face',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: '3',
    email: 'admin@eventsphere.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z'
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    description: 'A comprehensive technology conference featuring the latest in AI, web development, and cloud computing. Join industry leaders for inspiring talks and networking opportunities.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    date: '2024-03-15',
    startTime: '09:00',
    endTime: '17:00',
    location: 'Convention Center',
    address: '123 Tech Street, San Francisco, CA',
    price: 299,
    currency: 'USD',
    capacity: 500,
    availableTickets: 350,
    category: 'Technology',
    organizer: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c76e?w=400&h=400&fit=crop&crop=face'
    },
    tags: ['AI', 'Web Development', 'Cloud Computing'],
    status: 'published',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '2',
    title: 'Music Festival Summer 2024',
    description: 'Three days of incredible music featuring artists from around the world. Experience multiple genres across different stages with food trucks and art installations.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    date: '2024-06-20',
    startTime: '12:00',
    endTime: '23:00',
    location: 'Central Park',
    address: 'Central Park, New York, NY',
    price: 150,
    currency: 'USD',
    capacity: 10000,
    availableTickets: 8500,
    category: 'Music',
    organizer: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c76e?w=400&h=400&fit=crop&crop=face'
    },
    tags: ['Music', 'Festival', 'Outdoor'],
    status: 'published',
    createdAt: '2024-01-25T14:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z'
  },
  {
    id: '3',
    title: 'Business Networking Breakfast',
    description: 'Join fellow entrepreneurs and business professionals for an early morning networking session. Includes continental breakfast and structured networking activities.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop',
    date: '2024-02-28',
    startTime: '08:00',
    endTime: '10:00',
    location: 'Downtown Hotel',
    address: '456 Business Ave, Seattle, WA',
    price: 45,
    currency: 'USD',
    capacity: 100,
    availableTickets: 25,
    category: 'Business',
    organizer: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c76e?w=400&h=400&fit=crop&crop=face'
    },
    tags: ['Networking', 'Business', 'Breakfast'],
    status: 'published',
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z'
  },
  {
    id: '4',
    title: 'Art Gallery Opening',
    description: 'Exclusive opening of contemporary art exhibition featuring local and international artists. Wine and cheese reception included.',
    image: 'https://images.unsplash.com/photo-1544967919-6c6b20f63c5c?w=800&h=600&fit=crop',
    date: '2024-04-10',
    startTime: '18:00',
    endTime: '22:00',
    location: 'Modern Art Gallery',
    address: '789 Art District, Los Angeles, CA',
    price: 0,
    currency: 'USD',
    capacity: 200,
    availableTickets: 120,
    category: 'Art',
    organizer: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c76e?w=400&h=400&fit=crop&crop=face'
    },
    tags: ['Art', 'Gallery', 'Culture'],
    status: 'published',
    createdAt: '2024-02-01T16:00:00Z',
    updatedAt: '2024-02-01T16:00:00Z'
  },
  {
    id: '5',
    title: 'Yoga & Wellness Retreat',
    description: 'A day-long retreat focused on mindfulness, yoga practice, and wellness workshops. Includes healthy meals and meditation sessions.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    date: '2024-05-05',
    startTime: '09:00',
    endTime: '16:00',
    location: 'Wellness Center',
    address: '321 Peaceful Lane, Austin, TX',
    price: 120,
    currency: 'USD',
    capacity: 50,
    availableTickets: 12,
    category: 'Health',
    organizer: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c76e?w=400&h=400&fit=crop&crop=face'
    },
    tags: ['Yoga', 'Wellness', 'Mindfulness'],
    status: 'published',
    createdAt: '2024-02-10T12:00:00Z',
    updatedAt: '2024-02-10T12:00:00Z'
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    eventId: '1',
    event: mockEvents[0],
    ticketQuantity: 2,
    totalAmount: 598,
    status: 'confirmed',
    bookingDate: '2024-02-01T15:30:00Z',
    paymentStatus: 'paid',
    ticketCode: 'TC24-001-001'
  },
  {
    id: '2',
    userId: '1',
    eventId: '3',
    event: mockEvents[2],
    ticketQuantity: 1,
    totalAmount: 45,
    status: 'confirmed',
    bookingDate: '2024-02-15T09:15:00Z',
    paymentStatus: 'paid',
    ticketCode: 'TC24-003-002'
  },
  {
    id: '3',
    userId: '1',
    eventId: '4',
    event: mockEvents[3],
    ticketQuantity: 1,
    totalAmount: 0,
    status: 'confirmed',
    bookingDate: '2024-02-20T14:00:00Z',
    paymentStatus: 'paid',
    ticketCode: 'TC24-004-003'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'booking_confirmed',
    title: 'Booking Confirmed',
    message: 'Your booking for Tech Conference 2024 has been confirmed!',
    isRead: false,
    createdAt: '2024-02-01T15:35:00Z',
    data: { eventId: '1', bookingId: '1' }
  },
  {
    id: '2',
    userId: '1',
    type: 'event_reminder',
    title: 'Event Reminder',
    message: 'Business Networking Breakfast is starting in 2 hours.',
    isRead: false,
    createdAt: '2024-02-28T06:00:00Z',
    data: { eventId: '3' }
  },
  {
    id: '3',
    userId: '1',
    type: 'payment_success',
    title: 'Payment Successful',
    message: 'Payment of $45.00 processed successfully for Business Networking Breakfast.',
    isRead: true,
    createdAt: '2024-02-15T09:16:00Z',
    data: { amount: 45, eventId: '3' }
  }
];

export const mockDashboardStats: DashboardStats = {
  totalEvents: 5,
  totalBookings: 150,
  totalRevenue: 45750,
  upcomingEvents: 4,
  recentBookings: mockBookings.slice(0, 3),
  popularEvents: mockEvents.slice(0, 3),
  monthlyRevenue: [
    { month: 'Jan', revenue: 12500, bookings: 45 },
    { month: 'Feb', revenue: 18750, bookings: 67 },
    { month: 'Mar', revenue: 14500, bookings: 38 },
    { month: 'Apr', revenue: 22300, bookings: 89 },
    { month: 'May', revenue: 19800, bookings: 72 },
    { month: 'Jun', revenue: 25400, bookings: 95 }
  ],
  eventsByCategory: [
    { category: 'Technology', count: 15 },
    { category: 'Music', count: 12 },
    { category: 'Business', count: 8 },
    { category: 'Art', count: 6 },
    { category: 'Health', count: 4 }
  ]
};

export const eventCategories = [
  'Technology',
  'Music',
  'Business',
  'Art',
  'Health',
  'Sports',
  'Education',
  'Food & Drink',
  'Travel',
  'Fashion'
];