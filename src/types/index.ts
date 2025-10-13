/**
 * Type Definitions for Calendar Appointments Application
 * 
 * Centralizes all TypeScript interfaces and types used throughout the
 * application. Provides type safety and clear contracts for data structures
 * across components, services, and API interactions.
 */

/**
 * Service interface representing available appointment services
 * 
 * Defines the structure for services that can be booked by customers,
 * including pricing, duration, and descriptive information.
 */
export interface Service {
  id: string;           // Unique service identifier
  name: string;         // Display name of the service
  description: string;  // Detailed service description
  duration: number;     // Service duration in minutes
  price: number;        // Service price in USD
}

/**
 * Time Slot interface for appointment scheduling
 * 
 * Represents individual time slots that can be booked for services.
 * Includes availability status and links to specific services and dates.
 */
export interface TimeSlot {
  id: string;           // Unique time slot identifier
  time: string;         // Time in HH:MM format (24-hour)
  available: boolean;   // Whether the slot is available for booking
  serviceId: string;    // Associated service identifier
  date: string;         // Date in YYYY-MM-DD format (ISO date)
}

/**
 * Appointment interface for scheduled appointments
 * 
 * Represents a confirmed appointment with client information, service details,
 * scheduling information, and status tracking. Used for appointment management
 * throughout the application lifecycle.
 */
export interface Appointment {
  id: string;           // Unique appointment identifier
  clientName: string;   // Client's full name
  clientPhone: string;  // Client's contact phone number
  serviceId: string;    // Associated service identifier
  serviceName: string;  // Service name (denormalized for convenience)
  date: string;         // Appointment date in YYYY-MM-DD format
  time: string;         // Appointment time in HH:MM format (24-hour)
  status: 'scheduled' | 'completed' | 'cancelled';  // Current appointment status
  createdAt: string;    // Creation timestamp (ISO string)
}

/**
 * Business interface for company information
 * 
 * Contains business profile information including contact details,
 * branding elements, and operational hours. Used for displaying
 * business information and generating contact links.
 */
export interface Business {
  name: string;         // Business name
  logo: string;         // Logo image URL or path
  phone: string;        // Business contact phone number
  address: string;      // Business physical address
  workingHours: {       // Business operational hours
    start: string;      // Opening time in HH:MM format
    end: string;        // Closing time in HH:MM format
  };
}

/**
 * Appointment Form Data interface
 * 
 * Represents the data structure for appointment booking forms.
 * Contains only the essential fields required for creating a new
 * appointment before it's processed and stored.
 */
export interface AppointmentFormData {
  clientName: string;   // Client's full name from form input
  clientPhone: string;  // Client's contact phone from form input
  serviceId: string;    // Selected service identifier
  date: string;         // Selected date in YYYY-MM-DD format
  time: string;         // Selected time in HH:MM format
}