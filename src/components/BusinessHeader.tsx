import type { Business } from '../types';
import { FaWhatsapp } from 'react-icons/fa';

interface BusinessHeaderProps {
  business: Business;
}

// Función para formatear el número de teléfono para WhatsApp
const formatPhoneForWhatsApp = (phone: string): string => {
  // Remover todos los caracteres que no sean números
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Si el número no empieza con código de país, agregar +57 (Colombia)
  if (cleanPhone.length === 10 && !cleanPhone.startsWith('57')) {
    return `57${cleanPhone}`;
  }
  
  // Si ya tiene código de país, usar tal como está
  return cleanPhone;
};

// Función para generar el enlace de WhatsApp
const generateWhatsAppLink = (phone: string): string => {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const message = encodeURIComponent('¡Hola! Me gustaría obtener más información sobre sus servicios.');
  return `https://wa.me/${formattedPhone}?text=${message}`;
};

const BusinessHeader: React.FC<BusinessHeaderProps> = ({ business }) => {
  return (
    <header className="business-header">
      <div className="business-info">
        {/* <div className="logo">{business.logo}</div> */}
        <div className="details">
          <h1>{business.name}</h1>
          <div className="contact-info">
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
          <p className="address">📍 {business.address}</p>
        </div>
      </div>
    </header>
  );
};

export default BusinessHeader;