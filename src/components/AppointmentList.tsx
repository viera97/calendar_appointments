import React from 'react';
import type { Appointment } from '../types';
import { formatTime } from '../services/utils';

/**
 * Appointment List Component
 * 
 * Displays a comprehensive list of appointments organized by status.
 * Shows upcoming appointments first, followed by historical records.
 * Provides cancellation functionality for scheduled appointments.
 */

// Props interface for the appointment list component
interface AppointmentListProps {
  appointments: Appointment[];                                    // Array of appointments to display
  onCancelAppointment?: (appointmentId: string) => void;        // Optional callback for appointment cancellation
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  appointments, 
  onCancelAppointment 
}) => {
  // Display empty state when no appointments exist
  if (appointments.length === 0) {
    return (
      <div className="appointment-list empty">
        <h2>Mis Citas</h2>
        <p className="no-appointments">No tienes citas agendadas.</p>
      </div>
    );
  }

  // Group appointments by status for better organization
  const scheduledAppointments = appointments.filter(apt => apt.status === 'scheduled');
  const otherAppointments = appointments.filter(apt => apt.status !== 'scheduled');

  /**
   * Format date string to user-friendly Spanish format
   * @param dateStr - ISO date string to format
   * @returns Formatted date string in Spanish locale
   */
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',    // Full weekday name
      year: 'numeric',    // Full year
      month: 'long',      // Full month name
      day: 'numeric'      // Day number
    });
  };

  /**
   * Get Spanish text representation of appointment status
   * @param status - Appointment status code
   * @returns Spanish status text for display
   */
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'scheduled': return 'Agendada';     // Scheduled appointment
      case 'completed': return 'Completada';   // Completed appointment
      case 'cancelled': return 'Cancelada';    // Cancelled appointment
      default: return status;                  // Fallback to original status
    }
  };

  /**
   * Get CSS class for status-based styling
   * @param status - Appointment status code
   * @returns CSS class string for status styling
   */
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'scheduled': return 'status-scheduled';   // Green styling for active appointments
      case 'completed': return 'status-completed';   // Blue styling for completed appointments
      case 'cancelled': return 'status-cancelled';   // Red styling for cancelled appointments
      default: return '';                            // No special styling for unknown status
    }
  };

  return (
    <div className="appointment-list">
      <h2>Mis Citas</h2>
      
      {/* Upcoming/Scheduled appointments section */}
      {scheduledAppointments.length > 0 && (
        <div className="appointments-section">
          <h3>Próximas Citas</h3>
          {scheduledAppointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              {/* Appointment details section */}
              <div className="appointment-info">
                <h4>{appointment.serviceName}</h4>
                <p className="client-name">👤 {appointment.clientName}</p>
                <p className="date-time">
                  📅 {formatDate(appointment.date)} a las {formatTime(appointment.time)}
                </p>
                <p className="phone">📞 {appointment.clientPhone}</p>
                <span className={`status ${getStatusClass(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </span>
              </div>
              {/* Cancellation button for scheduled appointments */}
              {onCancelAppointment && appointment.status === 'scheduled' && (
                <div className="appointment-actions">
                  <button
                    onClick={() => onCancelAppointment(appointment.id)}
                    className="btn-cancel-appointment"
                  >
                    Cancelar Cita
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Historical appointments section (completed/cancelled) */}
      {otherAppointments.length > 0 && (
        <div className="appointments-section">
          <h3>Historial</h3>
          {otherAppointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              {/* Appointment details without action buttons */}
              <div className="appointment-info">
                <h4>{appointment.serviceName}</h4>
                <p className="client-name">👤 {appointment.clientName}</p>
                <p className="date-time">
                  📅 {formatDate(appointment.date)} a las {formatTime(appointment.time)}
                </p>
                <span className={`status ${getStatusClass(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;