import { useState, useEffect } from 'react';
import type { TimeSlot } from '../types';
import { fetchAvailableSlots } from '../services/timeSlotsService';
import { formatTime } from '../services/utils';

/**
 * Props interface for the TimeSlotSelector component
 */
interface TimeSlotSelectorProps {
  serviceId: string; // ID of the selected service
  selectedDate: string; // Selected date in YYYY-MM-DD format
  onTimeSelect: (time: string) => void; // Callback function when a time slot is selected
  selectedTime?: string; // Currently selected time slot (optional)
}

/**
 * TimeSlotSelector Component
 * 
 * This component displays available time slots for a specific service on a selected date.
 * It fetches available slots from the backend, shows loading states, and allows users
 * to select a time slot for their appointment.
 * 
 * Features:
 * - Fetches available time slots based on service and date
 * - Shows loading state while fetching data
 * - Displays available slots in a grid layout
 * - Highlights the currently selected time slot
 * - Shows appropriate messages when no slots are available
 */
const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  serviceId,
  selectedDate,
  onTimeSelect,
  selectedTime
}) => {
  // State for storing available time slots
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  // Loading state for async operations
  const [loading, setLoading] = useState(false);

  /**
   * Effect hook to fetch available time slots when service or date changes
   * Runs whenever serviceId or selectedDate props change
   */
  useEffect(() => {
    // Only fetch if both serviceId and selectedDate are provided
    if (serviceId && selectedDate) {
      setLoading(true);
      fetchAvailableSlots(serviceId, selectedDate)
        .then(setTimeSlots) // Set the fetched time slots
        .finally(() => setLoading(false)); // Always stop loading regardless of success/failure
    }
  }, [serviceId, selectedDate]);

  // Show loading spinner/message while fetching data
  if (loading) {
    return <div className="time-slots-loading">Cargando horarios disponibles...</div>;
  }

  // Show message when no time slots are returned from the API
  if (timeSlots.length === 0) {
    return <div className="no-slots">No hay horarios disponibles para esta fecha.</div>;
  }

  // Filter to show only available (not booked) time slots
  const availableSlots = timeSlots.filter(slot => slot.available);

  return (
    <div className="time-slot-selector">
      <h3>Horarios Disponibles</h3>
      <div className="time-slots-grid">
        {/* Render each available time slot as a clickable button */}
        {availableSlots.map((slot) => (
          <button
            key={slot.id}
            className={`time-slot ${selectedTime === slot.time ? 'selected' : ''}`}
            onClick={() => onTimeSelect(slot.time)}
          >
            {/* Format time from 24h to 12h format (e.g., 14:30 -> 2:30 PM) */}
            {formatTime(slot.time)}
          </button>
        ))}
      </div>
      {/* Show message when all slots are booked but some exist */}
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