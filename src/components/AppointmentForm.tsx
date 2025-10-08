import { useState } from 'react';
import type { Service, AppointmentFormData } from '../types';
import TimeSlotSelector from './TimeSlotSelector';

interface AppointmentFormProps {
  selectedService: Service;
  onSubmit: (formData: AppointmentFormData) => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  selectedService,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    clientName: '',
    clientPhone: '',
    serviceId: selectedService.id,
    date: '',
    time: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];
  
  // Obtener fecha máxima (30 días a partir de hoy)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'El nombre es requerido';
    }

    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'El teléfono es requerido';
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.clientPhone)) {
      newErrors.clientPhone = 'Por favor ingresa un teléfono válido';
    }

    if (!formData.date) {
      newErrors.date = 'Debes seleccionar una fecha';
    }

    if (!formData.time) {
      newErrors.time = 'Debes seleccionar un horario';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof AppointmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario comience a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="appointment-form">
      <h2>Agendar Cita - {selectedService.name}</h2>
      
      <form onSubmit={handleSubmit}>
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

        <div className="form-group">
          <label htmlFor="date">Fecha de la cita *</label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            min={today}
            max={maxDateStr}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>

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

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
          <button type="submit" className="btn-submit">
            Confirmar Cita
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;