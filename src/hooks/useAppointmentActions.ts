import { useState } from 'react';
import type { Service, Appointment, AppointmentFormData } from '../types';
import { appointmentStorage, generateAppointmentId } from '../services/appointmentStorage';
import { addAppointmentToBusinessCalendar, removeAppointmentFromBusinessCalendar } from '../services/businessCalendarService';

/**
 * Custom Hook for Appointment Management Logic
 * 
 * Handles the business logic for appointment operations including
 * creation, cancellation, and storage management. Provides callbacks
 * for UI interaction with proper error handling and business Google Calendar integration.
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
  
  // Loading state for appointment creation
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);

  /**
   * Handle appointment form submission with Google Calendar integration
   * @param formData - Form data from appointment booking
   */
  const handleAppointmentSubmit = async (formData: AppointmentFormData) => {
    setIsCreatingAppointment(true);
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

      // Save appointment locally/database first
      appointmentStorage.saveAppointment(newAppointment);
      addAppointment(newAppointment);

      // Format date and time for success message
      const appointmentDate = new Date(formData.date);
      const dateFormatted = appointmentDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
      });
      
      const [hours, minutes] = formData.time.split(':');
      const hour24 = parseInt(hours);
      const ampm = hour24 >= 12 ? 'PM' : 'AM';
      const hour12 = hour24 % 12 || 12;
      const timeFormatted = `${hour12}:${minutes} ${ampm}`;

      // Add to business Google Calendar automatically
      try {
        await addAppointmentToBusinessCalendar(newAppointment);
        showSuccess(`Cita agendada exitosamente y agregada al calendario del negocio para ${dateFormatted} a las ${timeFormatted}.`);
      } catch (error) {
        console.error('Error adding to business calendar:', error);
        showSuccess(`Cita agendada exitosamente para ${dateFormatted} a las ${timeFormatted}, pero no se pudo agregar al calendario del negocio.`);
      }

      // Navigate back to services view
      setSelectedService(undefined);
      setCurrentView('services');
    } catch (error) {
      console.error('Error al agendar la cita:', error);
      showError('Error al agendar la cita. Por favor intenta de nuevo.');
    } finally {
      setIsCreatingAppointment(false);
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
  const confirmCancelAppointment = async (appointmentId: string) => {
    try {
      appointmentStorage.cancelAppointment(appointmentId);
      updateAppointment(appointmentId, { status: 'cancelled' });
      
      // Remove from business Google Calendar
      try {
        await removeAppointmentFromBusinessCalendar(appointmentId);
        showSuccess('Cita cancelada exitosamente y removida del calendario del negocio.');
      } catch (error) {
        console.error('Error removing from business calendar:', error);
        showSuccess('Cita cancelada exitosamente, pero no se pudo remover del calendario del negocio.');
      }
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
    handleBackToServices,
    isCreatingAppointment
  };
};