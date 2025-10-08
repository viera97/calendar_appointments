import type { Appointment } from '../types';

const APPOINTMENTS_KEY = 'calendar_appointments';

export const appointmentStorage = {
  // Obtener todas las citas del localStorage
  getAppointments: (): Appointment[] => {
    try {
      const stored = localStorage.getItem(APPOINTMENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error al cargar las citas:', error);
      return [];
    }
  },

  // Guardar una nueva cita
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

  // Actualizar una cita existente
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>): void => {
    try {
      const appointments = appointmentStorage.getAppointments();
      const index = appointments.findIndex(apt => apt.id === appointmentId);
      
      if (index !== -1) {
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

  // Cancelar una cita
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

  // Eliminar una cita (opcional, para limpiar datos)
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

  // Limpiar todas las citas (útil para desarrollo)
  clearAllAppointments: (): void => {
    try {
      localStorage.removeItem(APPOINTMENTS_KEY);
    } catch (error) {
      console.error('Error al limpiar las citas:', error);
    }
  }
};

// Función auxiliar para generar ID único
export const generateAppointmentId = (): string => {
  return `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};