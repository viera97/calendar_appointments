import type { Appointment } from '../types';
import { formatTime } from '../services/mockApi';

interface AppointmentListProps {
  appointments: Appointment[];
  onCancelAppointment?: (appointmentId: string) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  appointments, 
  onCancelAppointment 
}) => {
  if (appointments.length === 0) {
    return (
      <div className="appointment-list empty">
        <h2>Mis Citas</h2>
        <p className="no-appointments">No tienes citas agendadas.</p>
      </div>
    );
  }

  // Agrupar citas por estado
  const scheduledAppointments = appointments.filter(apt => apt.status === 'scheduled');
  const otherAppointments = appointments.filter(apt => apt.status !== 'scheduled');

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'scheduled': return 'Agendada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'scheduled': return 'status-scheduled';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  return (
    <div className="appointment-list">
      <h2>Mis Citas</h2>
      
      {scheduledAppointments.length > 0 && (
        <div className="appointments-section">
          <h3>Próximas Citas</h3>
          {scheduledAppointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
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

      {otherAppointments.length > 0 && (
        <div className="appointments-section">
          <h3>Historial</h3>
          {otherAppointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
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