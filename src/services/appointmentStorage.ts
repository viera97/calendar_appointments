import type { Appointment } from '../types';

/**
 * Appointment Storage Service
 * 
 * Provides persistent storage functionality for appointments using localStorage.
 * Handles CRUD operations, error management, and data serialization for
 * appointment records. Offers fallback mechanisms for storage failures.
 */

// Storage key for localStorage to prevent conflicts with other app data
const APPOINTMENTS_KEY = 'calendar_appointments';

export const appointmentStorage = {
  /**
   * Retrieve all appointments from localStorage
   * 
   * Safely loads and parses appointment data from browser storage.
   * Returns empty array if no data exists or parsing fails.
   * 
   * @returns Array of Appointment objects
   */
  getAppointments: (): Appointment[] => {
    try {
      const stored = localStorage.getItem(APPOINTMENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error al cargar las citas:', error);
      return [];
    }
  },

  /**
   * Save a new appointment to storage
   * 
   * Adds a new appointment to the existing collection and persists
   * the updated list to localStorage. Throws error if save fails.
   * 
   * @param appointment - Complete appointment object to save
   * @throws Error if storage operation fails
   */
  saveAppointment: (appointment: Appointment): void => {
    try {
      const appointments = appointmentStorage.getAppointments();
      appointments.push(appointment);
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    } catch (error) {
      console.error('Error al guardar la cita:', error);
      throw new Error('No se pudo guardar la cita');
    }
  },

  /**
   * Update an existing appointment with partial data
   * 
   * Finds appointment by ID and merges provided updates with existing data.
   * Throws error if appointment not found or update fails.
   * 
   * @param appointmentId - Unique identifier of appointment to update
   * @param updates - Partial appointment data to merge with existing record
   * @throws Error if appointment not found or storage fails
   */
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>): void => {
    try {
      const appointments = appointmentStorage.getAppointments();
      const index = appointments.findIndex(apt => apt.id === appointmentId);
      
      if (index !== -1) {
        // Merge updates with existing appointment data
        appointments[index] = { ...appointments[index], ...updates };
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
      } else {
        throw new Error('Cita no encontrada');
      }
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
      throw new Error('No se pudo actualizar la cita');
    }
  },

  /**
   * Cancel an appointment by changing its status
   * 
   * Convenience method that updates appointment status to 'cancelled'.
   * Uses updateAppointment internally for consistency.
   * 
   * @param appointmentId - Unique identifier of appointment to cancel
   * @throws Error if appointment not found or cancellation fails
   */
  cancelAppointment: (appointmentId: string): void => {
    try {
      appointmentStorage.updateAppointment(appointmentId, { 
        status: 'cancelled' 
      });
    } catch (error) {
      console.error('Error al cancelar la cita:', error);
      throw new Error('No se pudo cancelar la cita');
    }
  },

  /**
   * Permanently delete an appointment from storage
   * 
   * Removes appointment record completely from localStorage.
   * Optional method for data cleanup and management.
   * 
   * @param appointmentId - Unique identifier of appointment to delete
   * @throws Error if deletion fails
   */
  deleteAppointment: (appointmentId: string): void => {
    try {
      const appointments = appointmentStorage.getAppointments();
      const filtered = appointments.filter(apt => apt.id !== appointmentId);
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      throw new Error('No se pudo eliminar la cita');
    }
  },

  /**
   * Clear all appointments from storage
   * 
   * Removes all appointment data from localStorage. Useful for
   * development, testing, or complete data reset scenarios.
   */
  clearAllAppointments: (): void => {
    try {
      localStorage.removeItem(APPOINTMENTS_KEY);
    } catch (error) {
      console.error('Error al limpiar las citas:', error);
    }
  },

  /**
   * Clear appointment history (completed and cancelled appointments only)
   * 
   * Removes only completed and cancelled appointments from storage,
   * keeping scheduled appointments intact.
   */
  clearHistory: (): void => {
    try {
      const appointments = appointmentStorage.getAppointments();
      const scheduledAppointments = appointments.filter(apt => apt.status === 'scheduled');
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(scheduledAppointments));
    } catch (error) {
      console.error('Error al limpiar el historial:', error);
      throw new Error('No se pudo limpiar el historial');
    }
  }
};

/**
 * Generate a unique appointment ID
 * 
 * Creates a unique identifier combining timestamp and random string
 * to ensure appointment IDs don't conflict. Uses 'apt_' prefix for
 * easy identification in logs and debugging.
 * 
 * @returns Unique appointment ID string
 */
export const generateAppointmentId = (): string => {
  return `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};