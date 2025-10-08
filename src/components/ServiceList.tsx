import type { Service } from '../types';
import { formatPrice } from '../services/mockApi';

interface ServiceListProps {
  services: Service[];
  onServiceSelect: (service: Service) => void;
  selectedService?: Service;
}

const ServiceList: React.FC<ServiceListProps> = ({ 
  services, 
  onServiceSelect, 
  selectedService 
}) => {
  return (
    <div className="service-list">
      <h2>Selecciona un Servicio</h2>
      <div className="services-grid">
        {services.map((service) => (
          <div
            key={service.id}
            className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
            onClick={() => onServiceSelect(service)}
          >
            <h3>{service.name}</h3>
            <p className="description">{service.description}</p>
            <div className="service-details">
              <span className="duration">⏱ {service.duration} min</span>
              <span className="price">{formatPrice(service.price)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;