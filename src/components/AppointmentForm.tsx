import { useState } from 'react';
import type { Service, AppointmentFormData } from '../types';
import TimeSlotSelector from './TimeSlotSelector';

/**
 * Appointment Form Component
 * 
 * Comprehensive form for collecting client information and scheduling appointments.
 * Includes date selection, time slot integration, form validation, and error handling.
 * Provides a complete booking flow with real-time validation feedback.
 */

// Props interface for the appointment form component
interface AppointmentFormProps {
  selectedService: Service;                              // Service to book the appointment for
  onSubmit: (formData: AppointmentFormData) => void | Promise<void>;    // Callback when form is successfully submitted
  onCancel: () => void;                                  // Callback when user cancels the form
  isCreatingAppointment?: boolean;                       // Loading state for appointment creation
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  selectedService,
  onSubmit,
  onCancel,
  isCreatingAppointment = false
}) => {
  // Form data state management with all required appointment fields
  const [formData, setFormData] = useState<AppointmentFormData>({
    clientName: '',           // Client's full name
    clientPhone: '',          // Client's contact phone number
    serviceId: selectedService.id,  // ID of the selected service
    date: '',                 // Selected appointment date (YYYY-MM-DD format)
    time: ''                  // Selected time slot (HH:MM format)
  });

  // Form validation errors state - tracks field-specific error messages
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Get minimum date (today) - prevents booking appointments in the past
  const today = new Date().toISOString().split('T')[0];
  
  // Get maximum date (30 days from today) - limits booking window
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  /**
   * Validate all form fields and return validation status
   * @returns True if all fields are valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Validate client name - required field with minimum length
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'El nombre es requerido';
    }

    // Validate phone number - required with basic format validation
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'El teléfono es requerido';
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.clientPhone)) {
      newErrors.clientPhone = 'Por favor ingresa un teléfono válido';
    }

    // Validate date selection - must be selected
    if (!formData.date) {
      newErrors.date = 'Debes seleccionar una fecha';
    }

    // Validate time selection - must be selected
    if (!formData.time) {
      newErrors.time = 'Debes seleccionar un horario';
    }

    // Update error state and return validation result
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission with validation
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Only proceed with submission if all fields pass validation
    if (validateForm()) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting appointment:', error);
      }
    }
  };

  /**
   * Handle input field changes and clear related errors
   * @param field - Form field name to update
   * @param value - New value for the field
   */
  const handleInputChange = (field: keyof AppointmentFormData, value: string) => {
    // Update form data with new value
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error message when user starts typing in a field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="appointment-form">
      {/* Loading overlay */}
      {isCreatingAppointment && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Agendando tu cita...</p>
            <p className="loading-subtext">Por favor espera un momento</p>
          </div>
        </div>
      )}
      
      {/* Form header with service name */}
      <h2>Agendar Cita - {selectedService.name}</h2>
      
      {/* Main appointment booking form */}
      <form onSubmit={handleSubmit}>
        {/* Client name input field */}
        <div className="form-group">
          <label htmlFor="clientName">Nombre completo *</label>
          <input
            type="text"
            id="clientName"
            value={formData.clientName}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            className={errors.clientName ? 'error' : ''}
            placeholder="Tu nombre completo"
          />
          {errors.clientName && <span className="error-message">{errors.clientName}</span>}
        </div>

        {/* Client phone input field with validation */}
        <div className="form-group">
          <label htmlFor="clientPhone">Teléfono *</label>
          <input
            type="tel"
            id="clientPhone"
            value={formData.clientPhone}
            onChange={(e) => handleInputChange('clientPhone', e.target.value)}
            className={errors.clientPhone ? 'error' : ''}
            placeholder="+57 300 123 4567"
          />
          {errors.clientPhone && <span className="error-message">{errors.clientPhone}</span>}
        </div>

        {/* Date selection with min/max constraints */}
        <div className="form-group">
          <label htmlFor="date">Fecha de la cita *</label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            min={today}              // Prevent past dates
            max={maxDateStr}         // Limit to 30 days ahead
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>

        {/* Time slot selector - only shown after date is selected */}
        {formData.date && (
          <div className="form-group">
            <TimeSlotSelector
              serviceId={selectedService.id}
              selectedDate={formData.date}
              onTimeSelect={(time) => handleInputChange('time', time)}
              selectedTime={formData.time}
            />
            {errors.time && <span className="error-message">{errors.time}</span>}
          </div>
        )}

        {/* Form action buttons */}
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
          <button 
            type="submit" 
            className={`btn-submit ${!formData.time || isCreatingAppointment ? 'disabled' : ''}`}
            disabled={!formData.clientName || !formData.clientPhone || !formData.date || !formData.time || isCreatingAppointment}
          >
            {isCreatingAppointment ? '⏳ Agendando...' : formData.time ? '✅ Confirmar Cita' : '⏳ Selecciona una hora'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;