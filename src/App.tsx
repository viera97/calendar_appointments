import { useState } from 'react';
import type { Service } from './types';
import BusinessHeader from './components/BusinessHeader';
import MainNavigation from './components/MainNavigation';
import MainContent from './components/MainContent';
import ConfirmModal from './components/ConfirmModal';
import Notification from './components/Notification';
import DarkModeToggle from './components/DarkModeToggle';
import { useAppData } from './hooks/useAppData';
import { useNotifications } from './hooks/useNotifications';
import { useConfirmModal } from './hooks/useConfirmModal';
import { useDarkMode } from './hooks/useDarkMode';
import { useAppointmentActions } from './hooks/useAppointmentActions';
import './App.css';

/**
 * Main Application Component
 * 
 * Root component that orchestrates all application functionality using
 * custom hooks for state management and modular components for UI.
 * Provides a clean separation of concerns and maintainable architecture.
 */
function App() {
  // View and service selection state
  const [currentView, setCurrentView] = useState<'services' | 'booking' | 'appointments'>('services');
  const [selectedService, setSelectedService] = useState<Service | undefined>();

  // Custom hooks for state management
  const { services, appointments, businessInfo, loading, addAppointment, updateAppointment } = useAppData();
  const { notification, showSuccess, showError, closeNotification } = useNotifications();
  const { confirmModal, showConfirmModal, closeConfirmModal } = useConfirmModal();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Appointment actions hook with all dependencies
  const { handleAppointmentSubmit, handleCancelAppointment, handleBackToServices } = useAppointmentActions({
    selectedService,
    addAppointment,
    updateAppointment,
    showSuccess,
    showError,
    showConfirmModal,
    setCurrentView,
    setSelectedService
  });

  /**
   * Handle service selection for booking
   * @param service - Selected service to book
   */
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentView('booking');
  };

  /**
   * Handle navigation view changes
   * @param view - Target view to navigate to
   */
  const handleViewChange = (view: 'services' | 'appointments') => {
    setCurrentView(view);
  };

  /**
   * Handle appointment cancellation with appointment lookup
   * @param appointmentId - ID of appointment to cancel
   */
  const handleAppointmentCancel = (appointmentId: string) => {
    handleCancelAppointment(appointmentId, appointments);
  };

  // Show loading state
  if (loading || !businessInfo) {
    return (
      <div className="app loading">
        <div className="loading-message">Cargando...</div>
      </div>
    );
  }

  // Count of scheduled appointments for navigation badge
  const scheduledAppointmentsCount = appointments.filter(apt => apt.status === 'scheduled').length;

  return (
    <div className="app">
      {/* Business header with company information */}
      <BusinessHeader business={businessInfo} />
      
      {/* Dark mode toggle button */}
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
      
      {/* Main navigation menu */}
      <MainNavigation 
        currentView={currentView}
        onViewChange={handleViewChange}
        appointmentCount={scheduledAppointmentsCount}
      />

      {/* Main application content */}
      <MainContent
        currentView={currentView}
        services={services}
        appointments={appointments}
        selectedService={selectedService}
        onServiceSelect={handleServiceSelect}
        onAppointmentSubmit={handleAppointmentSubmit}
        onCancelAppointment={handleAppointmentCancel}
        onBackToServices={handleBackToServices}
      />

      {/* Application footer */}
      <footer className="app-footer">
        <p>© 2024 {businessInfo?.name || 'Negocio'}. Todos los derechos reservados.</p>
      </footer>

      {/* Confirmation modal for user actions */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
        confirmText="Sí, cancelar"
        cancelText="No, mantener"
        type="danger"
      />

      {/* Notification system for user feedback */}
      <Notification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
    </div>
  );
}

export default App;
