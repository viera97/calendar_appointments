import type { TimeSlot } from '../types';

/**
 * Time Slots Service Module
 * 
 * Generates and manages available time slots for appointments based on
 * business hours. For development, all slots are available.
 */

/**
 * Generate available time slots for a service on a specific date
 * 
 * Creates time slots based on business hours. For development, generates
 * all possible slots without complex validation.
 * 
 * @param serviceId - Unique identifier of the service
 * @param date - Target date in YYYY-MM-DD format
 * @returns Array of TimeSlot objects with availability status
 */
export const generateTimeSlots = (serviceId: string, date: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  // Business hours configuration (9:00 AM - 6:00 PM)
  const startHour = 9;          // Opening hour
  const endHour = 18;           // Closing hour
  const slotDuration = 30;      // Duration per slot in minutes

  // Generate time slots every 30 minutes within business hours
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      // Format time as HH:MM
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // For development: generate all slots without service validation
      slots.push({
        id: `${serviceId}-${date}-${time}`,        // Unique slot identifier
        time,                                      // Time in HH:MM format
        available: true,                           // All slots available for development
        serviceId,                                 // Associated service ID
        date                                       // Date in YYYY-MM-DD format
      });
    }
  }

  return slots;
};

/**
 * Fetch available time slots with API simulation
 * 
 * Simulates an asynchronous API call to retrieve available time slots.
 * Includes artificial delay to mimic real-world network conditions and
 * provides a consistent interface for slot retrieval.
 * 
 * @param serviceId - Unique identifier of the service
 * @param date - Target date in YYYY-MM-DD format  
 * @returns Promise<TimeSlot[]> - Array of available time slots
 */
export const fetchAvailableSlots = async (serviceId: string, date: string): Promise<TimeSlot[]> => {
  // Simulate API response delay (200ms - reduced for better UX)
  await new Promise(resolve => setTimeout(resolve, 200));
  return generateTimeSlots(serviceId, date);
};

// Export service functions for use throughout the application
export default { generateTimeSlots, fetchAvailableSlots };