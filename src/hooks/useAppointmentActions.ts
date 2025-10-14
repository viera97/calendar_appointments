import type { Service, Appointment, AppointmentFormData } from '../types';
import { appointmentStorage, generateAppointmentId } from '../services/appointmentStorage';

/**
 * Custom Hook for Appointment Management Logic
 * 
 * Handles the business logic for appointment operations including
 * creation, cancellation, and storage management. Provides callbacks
 * for UI interaction with proper error handling.
 */

// Hook parameters interface
interface UseAppointmentActionsParams {
  selectedService: Service | undefined;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showConfirmModal: (title: string, message: string, onConfirm: () => void) => void;
  setCurrentView: (view: 'services' | 'booking' | 'appointments') => void;
  setSelectedService: (service: Service | undefined) => void;
}

export const useAppointmentActions = ({
  selectedService,
  addAppointment,
  updateAppointment,
  showSuccess,
  showError,
  showConfirmModal,
  setCurrentView,
  setSelectedService
}: UseAppointmentActionsParams) => {

  /**
   * Handle appointment form submission
   * @param formData - Form data from appointment booking
   */
  const handleAppointmentSubmit = (formData: AppointmentFormData) => {
    try {
      const newAppointment: Appointment = {
        id: generateAppointmentId(),
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        serviceId: formData.serviceId,
        serviceName: selectedService?.name || '',
        date: formData.date,
        time: formData.time,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      appointmentStorage.saveAppointment(newAppointment);
      
      // Update local state
      addAppointment(newAppointment);
      
      // Show success notification
      showSuccess('¡Cita agendada exitosamente!');
      
      // Navigate to appointments view and reset
      setCurrentView('appointments');
      setSelectedService(undefined);
    } catch (error) {
      console.error('Error al agendar la cita:', error);
      showError('Error al agendar la cita. Por favor intenta de nuevo.');
    }
  };

  /**
   * Handle appointment cancellation request
   * @param appointmentId - ID of appointment to cancel
   * @param appointments - Current appointments array for lookup
   */
  const handleCancelAppointment = (appointmentId: string, appointments: Appointment[]) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    showConfirmModal(
      'Cancelar Cita',
      `¿Estás seguro de que quieres cancelar la cita de ${appointment.serviceName}?`,
      () => confirmCancelAppointment(appointmentId)
    );
  };

  /**
   * Confirm and execute appointment cancellation
   * @param appointmentId - ID of appointment to cancel
   */
  const confirmCancelAppointment = (appointmentId: string) => {
    try {
      appointmentStorage.cancelAppointment(appointmentId);
      updateAppointment(appointmentId, { status: 'cancelled' });
      
      showSuccess('Cita cancelada exitosamente.');
    } catch (error) {
      console.error('Error al cancelar la cita:', error);
      showError('Error al cancelar la cita. Por favor intenta de nuevo.');
    }
  };

  /**
   * Handle navigation back to services view
   */
  const handleBackToServices = () => {
    setSelectedService(undefined);
    setCurrentView('services');
  };

  return {
    handleAppointmentSubmit,
    handleCancelAppointment,
    handleBackToServices
  };
};