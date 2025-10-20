import React from 'react';
import type { Service, Appointment, AppointmentFormData } from '../types';
import ServiceList from './ServiceList';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';

/**
 * Main Content Component
 * 
 * Renders the appropriate content based on the current view state.
 * Acts as a router for different application views and manages
 * the display of services, booking form, and appointments list.
 */

// Props interface for the main content component
interface MainContentProps {
  currentView: 'services' | 'booking' | 'appointments';     // Current active view
  services: Service[];                                       // Available services
  appointments: Appointment[];                               // User appointments
  selectedService: Service | undefined;                     // Currently selected service
  onServiceSelect: (service: Service) => void;              // Service selection callback
  onAppointmentSubmit: (formData: AppointmentFormData) => void | Promise<void>; // Appointment submission callback
  onCancelAppointment: (appointmentId: string) => void;     // Appointment cancellation callback
  onBackToServices: () => void;                             // Back navigation callback
}

const MainContent: React.FC<MainContentProps> = ({
  currentView,
  services,
  appointments,
  selectedService,
  onServiceSelect,
  onAppointmentSubmit,
  onCancelAppointment,
  onBackToServices
}) => {
  return (
    <main className="main-content">
      {/* Services view - displays available services */}
      {currentView === 'services' && (
        <ServiceList 
          services={services}
          onServiceSelect={onServiceSelect}
          selectedService={selectedService}
        />
      )}

      {/* Booking view - displays appointment form for selected service */}
      {currentView === 'booking' && selectedService && (
        <AppointmentForm
          selectedService={selectedService}
          onSubmit={onAppointmentSubmit}
          onCancel={onBackToServices}
        />
      )}

      {/* Appointments view - displays user's appointments */}
      {currentView === 'appointments' && (
        <AppointmentList 
          appointments={appointments}
          onCancelAppointment={onCancelAppointment}
        />
      )}
    </main>
  );
};

export default MainContent;