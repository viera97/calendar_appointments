/**
 * Business Calendar Service
 * 
 * Integrates with local backend API to manage Google Calendar appointments.
 * Sends appointment data to the backend which handles Google Calendar API integration.
 */

import type { Appointment } from '../types';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

// Interface for the backend API request
interface CalendarApiRequest {
  client_name: string;
  phone_number: string;
  service_type: string;
  start_time: string;
  end_time: string;
  additional_notes: string;
  timezone: string;
}

/**
 * Convert appointment to backend API format
 */
const convertToApiFormat = (appointment: Appointment): CalendarApiRequest => {
  const startDateTime = new Date(`${appointment.date}T${appointment.time}:00`);
  const endDateTime = new Date(startDateTime.getTime() + (60 * 60 * 1000));
  
  return {
    client_name: appointment.clientName,
    phone_number: appointment.clientPhone,
    service_type: appointment.serviceName,
    start_time: startDateTime.toISOString(),
    end_time: endDateTime.toISOString(),
    additional_notes: `Cita ID: ${appointment.id}\nEstado: ${appointment.status}\nCreada: ${new Date(appointment.createdAt).toLocaleString('es-ES')}`,
    timezone: 'America/Bogota'
  };
};

/**
 * Add appointment to business Google Calendar via backend API
 */
export const addAppointmentToBusinessCalendar = async (appointment: Appointment): Promise<void> => {
  try {
    console.log('📅 Sending appointment to backend API:', {
      client: appointment.clientName,
      service: appointment.serviceName,
      date: appointment.date,
      time: appointment.time
    });
    
    const apiData = convertToApiFormat(appointment);
    
    console.log('📋 API request data:', {
      client_name: apiData.client_name,
      service_type: apiData.service_type,
      start_time: apiData.start_time,
      end_time: apiData.end_time
    });
    
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Appointment successfully added to Google Calendar via backend:', result);
  } catch (error) {
    console.error('❌ Error adding appointment to Google Calendar:', error);
    throw new Error(`Failed to add appointment to Google Calendar: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateAppointmentInBusinessCalendar = async (appointmentId: string, appointment: Appointment): Promise<void> => {
  try {
    console.log('📅 Updating appointment in backend API:', appointmentId);
    const apiData = convertToApiFormat(appointment);
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(apiData)
    });
    if (!response.ok) {
      console.warn(`Update endpoint not available (${response.status})`);
      return;
    }
    console.log('✅ Appointment updated in Google Calendar via backend');
  } catch (error) {
    console.error('❌ Error updating appointment:', error);
  }
};

export const removeAppointmentFromBusinessCalendar = async (appointmentId: string): Promise<void> => {
  try {
    console.log('📅 Removing appointment from backend API:', appointmentId);
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      console.warn(`Delete endpoint not available (${response.status})`);
      return;
    }
    console.log('✅ Appointment removed from Google Calendar via backend');
  } catch (error) {
    console.error('❌ Error removing appointment:', error);
  }
};

export const isServiceAccountConfigured = (): boolean => true;

/**
 * Get API configuration status
 */
export const getConfigurationStatus = () => {
  return {
    apiUrl: API_BASE_URL,
    isConfigured: true,
    endpointAvailable: 'Check with isApiAvailable()',
    requiredEndpoints: [
      'POST /appointments - ✅ Available (main endpoint)',
      'PUT /appointments/{id} - ⚠️ Optional (for updates)',
      'DELETE /appointments/{id} - ⚠️ Optional (for cancellations)',
      'GET /health - ⚠️ Optional (for status check)'
    ]
  };
};

/**
 * Check if backend API is available
 */
export const isApiAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    return response.ok;
  } catch {
    console.log('ℹ️ Backend API not available at:', API_BASE_URL);
    return false;
  }
};
