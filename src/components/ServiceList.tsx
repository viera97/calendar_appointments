import type { Service } from '../types';
import { formatPrice } from '../services/utils';

/**
 * Props interface for the ServiceList component
 */
interface ServiceListProps {
  services: Service[]; // Array of available services
  onServiceSelect: (service: Service) => void; // Callback function when a service is selected
  selectedService?: Service; // Currently selected service (optional)
}

/**
 * ServiceList Component
 * 
 * This component displays a grid of available services that users can select from.
 * Each service card shows the name, description, duration, and price.
 * 
 * Features:
 * - Displays services in a responsive grid layout
 * - Shows service details (name, description, duration, price)
 * - Highlights the currently selected service
 * - Handles service selection through click events
 */
const ServiceList: React.FC<ServiceListProps> = ({ 
  services, 
  onServiceSelect, 
  selectedService 
}) => {
  return (
    <div className="service-list">
      <h2>Selecciona un Servicio</h2>
      <div className="services-grid">
        {/* Render each service as a clickable card */}
        {services.map((service) => (
          <div
            key={service.id}
            className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
            onClick={() => onServiceSelect(service)}
          >
            {/* Service name as main heading */}
            <h3>{service.name}</h3>
            {/* Service description */}
            <p className="description">{service.description}</p>
            <div className="service-details">
              {/* Duration in minutes with clock icon */}
              <span className="duration">⏱ {service.duration} min</span>
              {/* Formatted price in dollars */}
              <span className="price">{formatPrice(service.price)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;