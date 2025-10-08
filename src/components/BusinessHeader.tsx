import type { Business } from '../types';

interface BusinessHeaderProps {
  business: Business;
}

const BusinessHeader: React.FC<BusinessHeaderProps> = ({ business }) => {
  return (
    <header className="business-header">
      <div className="business-info">
        <div className="logo">{business.logo}</div>
        <div className="details">
          <h1>{business.name}</h1>
          <p className="contact">📞 {business.phone}</p>
          <p className="address">📍 {business.address}</p>
          <p className="hours">
            🕐 Horario: {business.workingHours.start} - {business.workingHours.end}
          </p>
        </div>
      </div>
    </header>
  );
};

export default BusinessHeader;