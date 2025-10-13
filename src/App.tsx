import { useState, useEffect } from 'react';
import type { Service, Appointment, AppointmentFormData } from './types';
import { businessInfo, fetchServices } from './services/mockApi';
import { appointmentStorage, generateAppointmentId } from './services/appointmentStorage';
import BusinessHeader from './components/BusinessHeader';
import ServiceList from './components/ServiceList';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import ConfirmModal from './components/ConfirmModal';
import Notification from './components/Notification';
import DarkModeToggle from './components/DarkModeToggle';
import './App.css';

function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [currentView, setCurrentView] = useState<'services' | 'booking' | 'appointments'>('services');
  const [loading, setLoading] = useState(false);
  
  // Estados para modal de confirmación
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    appointmentId: ''
  });
  
  // Estados para notificaciones
  const [notification, setNotification] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  });

  // Estado para modo oscuro
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Efecto para aplicar el modo oscuro
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev: boolean) => !prev);
  };

  // Cargar servicios y citas al iniciar la aplicación
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Cargar servicios desde API mock
        const servicesData = await fetchServices();
        setServices(servicesData);
        
        // Cargar citas desde localStorage
        const storedAppointments = appointmentStorage.getAppointments();
        setAppointments(storedAppointments);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentView('booking');
  };

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

      // Guardar en localStorage
      appointmentStorage.saveAppointment(newAppointment);
      
      // Actualizar estado local
      setAppointments(prev => [...prev, newAppointment]);
      
      // Mostrar notificación de éxito
      setNotification({
        isOpen: true,
        message: '¡Cita agendada exitosamente!',
        type: 'success'
      });
      
      // Cambiar vista y resetear
      setCurrentView('appointments');
      setSelectedService(undefined);
    } catch (error) {
      console.error('Error al agendar la cita:', error);
      setNotification({
        isOpen: true,
        message: 'Error al agendar la cita. Por favor intenta de nuevo.',
        type: 'error'
      });
    }
  };

  const handleCancelAppointment = (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    setConfirmModal({
      isOpen: true,
      title: 'Cancelar Cita',
      message: `¿Estás seguro de que quieres cancelar la cita de ${appointment.serviceName}?`,
      onConfirm: () => confirmCancelAppointment(appointmentId),
      appointmentId
    });
  };

  const confirmCancelAppointment = (appointmentId: string) => {
    try {
      appointmentStorage.cancelAppointment(appointmentId);
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'cancelled' as const }
            : apt
        )
      );
      
      setNotification({
        isOpen: true,
        message: 'Cita cancelada exitosamente.',
        type: 'success'
      });
    } catch (error) {
      console.error('Error al cancelar la cita:', error);
      setNotification({
        isOpen: true,
        message: 'Error al cancelar la cita. Por favor intenta de nuevo.',
        type: 'error'
      });
    } finally {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleBackToServices = () => {
    setSelectedService(undefined);
    setCurrentView('services');
  };

  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-message">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <BusinessHeader business={businessInfo} />
      
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
      
      <nav className="main-nav">
        <button 
          className={currentView === 'services' ? 'active' : ''}
          onClick={() => setCurrentView('services')}
        >
          Servicios
        </button>
        <button 
          className={currentView === 'appointments' ? 'active' : ''}
          onClick={() => setCurrentView('appointments')}
        >
          Mis Citas ({appointments.filter(apt => apt.status === 'scheduled').length})
        </button>
      </nav>

      <main className="main-content">
        {currentView === 'services' && (
          <ServiceList 
            services={services}
            onServiceSelect={handleServiceSelect}
            selectedService={selectedService}
          />
        )}

        {currentView === 'booking' && selectedService && (
          <AppointmentForm
            selectedService={selectedService}
            onSubmit={handleAppointmentSubmit}
            onCancel={handleBackToServices}
          />
        )}

        {currentView === 'appointments' && (
          <AppointmentList 
            appointments={appointments}
            onCancelAppointment={handleCancelAppointment}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 {businessInfo.name}. Todos los derechos reservados.</p>
      </footer>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        confirmText="Sí, cancelar"
        cancelText="No, mantener"
        type="danger"
      />

      {/* Notificaciones */}
      <Notification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default App;
