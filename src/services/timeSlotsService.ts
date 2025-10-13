import type { TimeSlot, Service } from '../types';

/**
 * Time Slots Service Module
 * 
 * Generates and manages available time slots for appointments based on
 * business hours, service duration, and availability logic. Provides
 * flexible scheduling with configurable parameters.
 */

/**
 * Generate available time slots for a service on a specific date
 * 
 * Creates time slots based on business hours and service duration requirements.
 * Ensures adequate time allocation and prevents booking conflicts by validating
 * service completion time against closing hours.
 * 
 * @param serviceId - Unique identifier of the service
 * @param date - Target date in YYYY-MM-DD format
 * @param services - Array of available services (optional, for validation)
 * @returns Array of TimeSlot objects with availability status
 */
export const generateTimeSlots = (serviceId: string, date: string, services: Service[] = []): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const service = services.find(s => s.id === serviceId);
  
  // Return empty array if service not found
  if (!service) return slots;

  // Business hours configuration (9:00 AM - 6:00 PM)
  const startHour = 9;          // Opening hour
  const endHour = 18;           // Closing hour
  const slotDuration = 30;      // Duration per slot in minutes

  // Generate time slots every 30 minutes within business hours
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      // Format time as HH:MM
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Validate that service can be completed before closing time
      const slotTime = new Date(`${date} ${time}`);
      const serviceEndTime = new Date(slotTime.getTime() + service.duration * 60000);
      const closingTime = new Date(`${date} ${endHour}:00`);
      
      // Only add slot if service can be completed before closing
      if (serviceEndTime <= closingTime) {
        slots.push({
          id: `${serviceId}-${date}-${time}`,        // Unique slot identifier
          time,                                      // Time in HH:MM format
          available: Math.random() > 0.3,           // 70% availability probability
          serviceId,                                 // Associated service ID
          date                                       // Date in YYYY-MM-DD format
        });
      }
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
 * @param services - Optional array of services for validation
 * @returns Promise<TimeSlot[]> - Array of available time slots
 */
export const fetchAvailableSlots = async (serviceId: string, date: string, services?: Service[]): Promise<TimeSlot[]> => {
  // Simulate API response delay (500ms)
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateTimeSlots(serviceId, date, services);
};

// Export service functions for use throughout the application
export default { generateTimeSlots, fetchAvailableSlots };