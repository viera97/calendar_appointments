import { useState, useEffect } from 'react';
import type { Service, Appointment, Business } from '../types';
import { fetchServices } from '../services/servicesService';
import { fetchBusinessInfo } from '../services/businessService';
import { appointmentStorage, generateAppointmentId } from '../services/appointmentStorage';
import { testConnection } from '../lib/supabase';
import { addAppointmentToBusinessCalendar } from '../services/businessCalendarService';

/**
 * Custom Hook for Application Data Management
 * 
 * Handles loading and management of services, appointments, and business data.
 * Provides centralized state management for the main application entities
 * with proper error handling and loading states.
 */
export const useAppData = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [businessInfo, setBusinessInfo] = useState<Business | null>(null);
  const [loading, setLoading] = useState(false);

  // Load initial data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Test Supabase connection
        console.log('🔗 Probando conexión a Supabase...');
        const isConnected = await testConnection();
        if (isConnected) {
          console.log('✅ Conexión a Supabase establecida correctamente');
        } else {
          console.log('❌ Error al conectar con Supabase');
        }
        
        // Load data in parallel for better performance
        const [servicesData, businessData] = await Promise.all([
          fetchServices(),
          fetchBusinessInfo()
        ]);
        
        setServices(servicesData);
        setBusinessInfo(businessData);
        
        // Load appointments from localStorage
        const storedAppointments = appointmentStorage.getAppointments();
        setAppointments(storedAppointments);

        // Create test appointment for Google Calendar connection testing
        await createTestGoogleCalendarAppointment();
        
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /**
   * Create a test appointment for Google Calendar integration testing
   * Creates appointment for October 17, 2025 at 10:00 AM
   */
  const createTestGoogleCalendarAppointment = async () => {
    try {
      // Check if test appointment already exists
      const existingAppointments = appointmentStorage.getAppointments();
      const hasTestAppointment = existingAppointments.some(apt => 
        apt.clientName === 'Prueba Google Calendar' && apt.date === '2025-10-17'
      );
      
      if (hasTestAppointment) {
        console.log('🧪 Test appointment for Google Calendar already exists');
        return;
      }

      // Create test appointment
      const testAppointment: Appointment = {
        id: generateAppointmentId(),
        clientName: 'Prueba Google Calendar',
        clientPhone: '+57 300 123 4567',
        serviceId: 'test-service-google',
        serviceName: 'Prueba de Conexión Google Calendar',
        date: '2025-10-17',
        time: '10:00',
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      // Save to local storage
      appointmentStorage.saveAppointment(testAppointment);
      setAppointments(prev => [...prev, testAppointment]);

      // Try to add to Google Calendar
      try {
        await addAppointmentToBusinessCalendar(testAppointment);
        console.log('✅ Test appointment added to Google Calendar successfully');
      } catch (error) {
        console.error('❌ Error adding test appointment to Google Calendar:', error);
      }

    } catch (error) {
      console.error('Error creating test Google Calendar appointment:', error);
    }
  };

  /**
   * Add a new appointment to the state and storage
   * @param appointment - The appointment to add
   */
  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  /**
   * Update an existing appointment in state
   * @param appointmentId - ID of appointment to update
   * @param updates - Partial appointment data to update
   */
  const updateAppointment = (appointmentId: string, updates: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, ...updates }
          : apt
      )
    );
  };

  /**
   * Clear appointment history (completed and cancelled appointments)
   * Keeps scheduled appointments intact
   */
  const clearHistory = () => {
    try {
      appointmentStorage.clearHistory();
      setAppointments(prev => prev.filter(apt => apt.status === 'scheduled'));
    } catch (error) {
      console.error('Error al limpiar el historial:', error);
      throw error;
    }
  };

  return {
    services,
    appointments,
    businessInfo,
    loading,
    addAppointment,
    updateAppointment,
    clearHistory
  };
};