import type { Business } from '../types';
import { FaWhatsapp } from 'react-icons/fa';

/**
 * Props interface for the BusinessHeader component
 */
interface BusinessHeaderProps {
  business: Business; // Business information object containing name, phone, address, etc.
}

/**
 * Format phone number for WhatsApp link
 * Removes non-numeric characters and adds country code if needed
 */
const formatPhoneForWhatsApp = (phone: string): string => {
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // If number doesn't start with country code, add +57 (Colombia)
  if (cleanPhone.length === 10 && !cleanPhone.startsWith('57')) {
    return `57${cleanPhone}`;
  }
  
  // If it already has country code, use as is
  return cleanPhone;
};

/**
 * Generate WhatsApp link with formatted phone and default message
 */
const generateWhatsAppLink = (phone: string): string => {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const message = encodeURIComponent('¡Hola! Me gustaría obtener más información sobre sus servicios.');
  return `https://wa.me/${formattedPhone}?text=${message}`;
};

/**
 * BusinessHeader Component
 * 
 * This component displays the business information at the top of the application.
 * It shows the business name, contact information, and address.
 * 
 * Features:
 * - Displays business name as main heading
 * - Shows WhatsApp contact link with phone number
 * - Formats phone number for WhatsApp integration
 * - Displays business address with location icon
 * - Responsive design for different screen sizes
 */
const BusinessHeader: React.FC<BusinessHeaderProps> = ({ business }) => {
  return (
    <header className="business-header">
      <div className="business-info">
        {/* Logo section commented out - can be uncommented when logo is available */}
        {/* <div className="logo">{business.logo}</div> */}
        <div className="details">
          {/* Business name as main heading */}
          <h1>{business.name}</h1>
          <div className="contact-info">
            {/* WhatsApp contact link with formatted phone number */}
            <a 
              href={generateWhatsAppLink(business.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-link"
              title="Escribir por WhatsApp"
            >
              <FaWhatsapp className="whatsapp-icon" />
              {business.phone}
            </a>
          </div>
          {/* Business address with location icon */}
          <p className="address">📍 {business.address}</p>
        </div>
      </div>
    </header>
  );
};

export default BusinessHeader;