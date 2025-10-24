export interface AppointmentRequest {
  client_name: string;
  phone_number: string;
  service_type: string;
  start_time: string; // ISO string
  end_time: string; // ISO string
  additional_notes: string;
  timezone: string;
}

export interface AppointmentResponse {
  id?: string;
  message?: string;
  // Agregar otros campos que devuelva tu API
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const appointmentService = {
  async createAppointment(appointment: AppointmentRequest): Promise<AppointmentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },
};