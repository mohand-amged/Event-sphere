import type {
  User,
  Event,
  Booking,
  Notification,
  DashboardStats,
  LoginCredentials,
  RegisterCredentials,
  EventFilters,
  CreateEventData,
  ApiResponse
} from '../types';
import { 
  mockUsers, 
  mockEvents, 
  mockBookings, 
  mockNotifications, 
  mockDashboardStats 
} from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication token storage
let currentUser: User | null = mockUsers[0]; // Default to first user for demo

// Auth API
export const authApi = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(1000);
    
    const user = mockUsers.find(u => u.email === credentials.email);
    if (user && credentials.password === 'password') {
      currentUser = user;
      return {
        success: true,
        data: {
          user,
          token: 'mock-jwt-token-' + user.id
        }
      };
    }
    
    throw new Error('Invalid credentials');
  },

  async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(1200);
    
    // Check if user already exists
    if (mockUsers.find(u => u.email === credentials.email)) {
      throw new Error('User already exists');
    }
    
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email: credentials.email,
      name: credentials.name,
      role: credentials.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    currentUser = newUser;
    
    return {
      success: true,
      data: {
        user: newUser,
        token: 'mock-jwt-token-' + newUser.id
      }
    };
  },

  async logout(): Promise<ApiResponse<null>> {
    await delay(500);
    currentUser = null;
    return {
      success: true,
      data: null
    };
  },

  getCurrentUser(): User | null {
    return currentUser;
  }
};

// Events API
export const eventsApi = {
  async getEvents(filters?: EventFilters): Promise<ApiResponse<Event[]>> {
    await delay(800);
    
    let filteredEvents = [...mockEvents];
    
    if (filters) {
      if (filters.search) {
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
          event.description.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
      
      if (filters.category) {
        filteredEvents = filteredEvents.filter(event => event.category === filters.category);
      }
      
      if (filters.location) {
        filteredEvents = filteredEvents.filter(event =>
          event.location.toLowerCase().includes(filters.location!.toLowerCase()) ||
          event.address.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      if (filters.priceMin !== undefined) {
        filteredEvents = filteredEvents.filter(event => event.price >= filters.priceMin!);
      }
      
      if (filters.priceMax !== undefined) {
        filteredEvents = filteredEvents.filter(event => event.price <= filters.priceMax!);
      }
      
      // Sorting
      if (filters.sortBy) {
        filteredEvents.sort((a, b) => {
          let aValue, bValue;
          
          switch (filters.sortBy) {
            case 'date':
              aValue = new Date(a.date).getTime();
              bValue = new Date(b.date).getTime();
              break;
            case 'price':
              aValue = a.price;
              bValue = b.price;
              break;
            case 'created':
              aValue = new Date(a.createdAt).getTime();
              bValue = new Date(b.createdAt).getTime();
              break;
            default:
              aValue = a.title;
              bValue = b.title;
          }
          
          if (filters.sortOrder === 'desc') {
            return aValue < bValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }
    }
    
    return {
      success: true,
      data: filteredEvents,
      pagination: {
        page: 1,
        limit: filteredEvents.length,
        total: filteredEvents.length,
        pages: 1
      }
    };
  },

  async getEvent(id: string): Promise<ApiResponse<Event>> {
    await delay(600);
    
    const event = mockEvents.find(e => e.id === id);
    if (!event) {
      throw new Error('Event not found');
    }
    
    return {
      success: true,
      data: event
    };
  },

  async createEvent(eventData: CreateEventData): Promise<ApiResponse<Event>> {
    await delay(1000);
    
    if (!currentUser || currentUser.role === 'attendee') {
      throw new Error('Unauthorized');
    }
    
    const newEvent: Event = {
      id: (mockEvents.length + 1).toString(),
      ...eventData,
      currency: 'USD',
      availableTickets: eventData.capacity,
      organizer: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockEvents.push(newEvent);
    
    return {
      success: true,
      data: newEvent
    };
  },

  async updateEvent(id: string, eventData: Partial<CreateEventData>): Promise<ApiResponse<Event>> {
    await delay(1000);
    
    if (!currentUser || currentUser.role === 'attendee') {
      throw new Error('Unauthorized');
    }
    
    const eventIndex = mockEvents.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    const updatedEvent = {
      ...mockEvents[eventIndex],
      ...eventData,
      updatedAt: new Date().toISOString()
    };
    
    mockEvents[eventIndex] = updatedEvent;
    
    return {
      success: true,
      data: updatedEvent
    };
  },

  async deleteEvent(id: string): Promise<ApiResponse<null>> {
    await delay(800);
    
    if (!currentUser || currentUser.role === 'attendee') {
      throw new Error('Unauthorized');
    }
    
    const eventIndex = mockEvents.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    mockEvents.splice(eventIndex, 1);
    
    return {
      success: true,
      data: null
    };
  }
};

// Bookings API
export const bookingsApi = {
  async createBooking(eventId: string, ticketQuantity: number): Promise<ApiResponse<Booking>> {
    await delay(1500);
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const event = mockEvents.find(e => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    
    if (event.availableTickets < ticketQuantity) {
      throw new Error('Not enough tickets available');
    }
    
    const newBooking: Booking = {
      id: (mockBookings.length + 1).toString(),
      userId: currentUser.id,
      eventId,
      event,
      ticketQuantity,
      totalAmount: event.price * ticketQuantity,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      paymentStatus: 'paid',
      ticketCode: `TC24-${eventId.padStart(3, '0')}-${(mockBookings.length + 1).toString().padStart(3, '0')}`
    };
    
    mockBookings.push(newBooking);
    
    // Update available tickets
    event.availableTickets -= ticketQuantity;
    
    return {
      success: true,
      data: newBooking
    };
  },

  async getUserBookings(userId?: string): Promise<ApiResponse<Booking[]>> {
    await delay(700);
    
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) {
      throw new Error('User not authenticated');
    }
    
    const userBookings = mockBookings.filter(b => b.userId === targetUserId);
    
    return {
      success: true,
      data: userBookings
    };
  },

  async getBooking(id: string): Promise<ApiResponse<Booking>> {
    await delay(500);
    
    const booking = mockBookings.find(b => b.id === id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    return {
      success: true,
      data: booking
    };
  },

  async cancelBooking(id: string): Promise<ApiResponse<Booking>> {
    await delay(1000);
    
    const bookingIndex = mockBookings.findIndex(b => b.id === id);
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }
    
    const booking = mockBookings[bookingIndex];
    
    if (!currentUser || (booking.userId !== currentUser.id && currentUser.role !== 'admin')) {
      throw new Error('Unauthorized');
    }
    
    const updatedBooking = {
      ...booking,
      status: 'cancelled' as const
    };
    
    mockBookings[bookingIndex] = updatedBooking;
    
    return {
      success: true,
      data: updatedBooking
    };
  }
};

// Notifications API
export const notificationsApi = {
  async getNotifications(userId?: string): Promise<ApiResponse<Notification[]>> {
    await delay(600);
    
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) {
      throw new Error('User not authenticated');
    }
    
    const userNotifications = mockNotifications.filter(n => n.userId === targetUserId);
    
    return {
      success: true,
      data: userNotifications
    };
  },

  async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    await delay(400);
    
    const notificationIndex = mockNotifications.findIndex(n => n.id === id);
    if (notificationIndex === -1) {
      throw new Error('Notification not found');
    }
    
    mockNotifications[notificationIndex].isRead = true;
    
    return {
      success: true,
      data: mockNotifications[notificationIndex]
    };
  }
};

// Dashboard API
export const dashboardApi = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    await delay(1000);
    
    if (!currentUser || currentUser.role === 'attendee') {
      throw new Error('Unauthorized');
    }
    
    return {
      success: true,
      data: mockDashboardStats
    };
  }
};

// Users API (Admin only)
export const usersApi = {
  async getUsers(): Promise<ApiResponse<User[]>> {
    await delay(800);
    
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    
    return {
      success: true,
      data: mockUsers
    };
  },

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    await delay(900);
    
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    mockUsers[userIndex] = updatedUser;
    
    return {
      success: true,
      data: updatedUser
    };
  }
};