import { useState, useEffect } from 'react';
import type { TimeSlot } from '../types';
import { fetchAvailableSlots, formatTime } from '../services/mockApi';

interface TimeSlotSelectorProps {
  serviceId: string;
  selectedDate: string;
  onTimeSelect: (time: string) => void;
  selectedTime?: string;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  serviceId,
  selectedDate,
  onTimeSelect,
  selectedTime
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (serviceId && selectedDate) {
      setLoading(true);
      fetchAvailableSlots(serviceId, selectedDate)
        .then(setTimeSlots)
        .finally(() => setLoading(false));
    }
  }, [serviceId, selectedDate]);

  if (loading) {
    return <div className="time-slots-loading">Cargando horarios disponibles...</div>;
  }

  if (timeSlots.length === 0) {
    return <div className="no-slots">No hay horarios disponibles para esta fecha.</div>;
  }

  const availableSlots = timeSlots.filter(slot => slot.available);

  return (
    <div className="time-slot-selector">
      <h3>Horarios Disponibles</h3>
      <div className="time-slots-grid">
        {availableSlots.map((slot) => (
          <button
            key={slot.id}
            className={`time-slot ${selectedTime === slot.time ? 'selected' : ''}`}
            onClick={() => onTimeSelect(slot.time)}
          >
            {formatTime(slot.time)}
          </button>
        ))}
      </div>
      {availableSlots.length === 0 && (
        <p className="no-available-slots">
          No hay horarios disponibles para esta fecha. 
          Por favor selecciona otra fecha.
        </p>
      )}
    </div>
  );
};

export default TimeSlotSelector;