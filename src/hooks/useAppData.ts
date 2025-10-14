import { useState, useEffect } from 'react';
import type { Service, Appointment, Business } from '../types';
import { fetchServices } from '../services/servicesService';
import { fetchBusinessInfo } from '../services/businessService';
import { appointmentStorage } from '../services/appointmentStorage';
import { testConnection } from '../lib/supabase';

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
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  return {
    services,
    appointments,
    businessInfo,
    loading,
    addAppointment,
    updateAppointment
  };
};