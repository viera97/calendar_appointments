import React, { useState, useEffect } from 'react';
import { getConfigurationStatus } from '../services/businessCalendarService';

/**
 * Business Calendar Status Component
 * 
 * Shows the configuration status of the business Google Calendar integration.
 * Displays setup instructions and current configuration state.
 */
export const BusinessCalendarStatus: React.FC = () => {
  const [config, setConfig] = useState({
    apiUrl: 'http://127.0.0.1:8000',
    isConfigured: false,
    endpointAvailable: 'Check with isApiAvailable()',
    requiredEndpoints: [] as string[]
  });

  useEffect(() => {
    setConfig(getConfigurationStatus());
  }, []);

  return (
    <div className="business-calendar-status">
      <div className="calendar-header">
        <h3>🏢 Calendario del Negocio</h3>
        <div className={`status-indicator ${config.isConfigured ? 'configured' : 'not-configured'}`}>
          {config.isConfigured ? '✅ Configurado' : '⚙️ Requiere Configuración'}
        </div>
      </div>

      <div className="config-details">
        <div className="config-item">
          <span className={`config-status ${config.isConfigured ? 'ok' : 'missing'}`}>
            {config.isConfigured ? '✅' : '⚙️'}
          </span>
          <span>Backend API URL: {config.apiUrl}</span>
        </div>
        
        <div className="config-item">
          <span className="config-status ok">ℹ️</span>
          <span>Endpoint Status: {config.endpointAvailable}</span>
        </div>
        
        <div className="config-endpoints">
          <h4>📌 Endpoints Disponibles:</h4>
          <ul>
            {config.requiredEndpoints.map((endpoint, index) => (
              <li key={index} className="endpoint-item">
                {endpoint}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="setup-instructions">
        <h4>📋 Configuración del Backend API</h4>
        <div className="api-info">
          <p>✅ <strong>Integración Automática:</strong></p>
          <ul>
            <li>El frontend se conecta automáticamente a tu API local</li>
            <li>URL de la API: <code>{config.apiUrl}</code></li>
            <li>El backend maneja toda la integración con Google Calendar</li>
          </ul>
          
          <h5>🔧 Para verificar la conexión:</h5>
          <ol>
            <li>Asegúrate de que tu backend esté corriendo en <code>http://127.0.0.1:8000</code></li>
            <li>Verifica que el endpoint <code>/appointments</code> esté disponible</li>
            <li>Las citas se crearán automáticamente en Google Calendar via tu backend</li>
          </ol>
        </div>
      </div>

      <div className="info-section">
        <h4>ℹ️ Cómo Funciona la Integración</h4>
        <ul>
          <li>✅ El frontend envía citas a tu backend API</li>
          <li>✅ Tu backend se encarga de la integración con Google Calendar</li>
          <li>✅ No requiere configuración adicional en el frontend</li>
          <li>✅ Las citas aparecen automáticamente en tu Google Calendar</li>
        </ul>
      </div>

      <style>{`
        .business-calendar-status {
          background: var(--card-background);
          border-radius: 12px;
          padding: 1.5rem;
          margin: 1rem 0;
          border: 1px solid var(--border-color);
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .calendar-header h3 {
          margin: 0;
          color: var(--text-color);
          font-size: 1.1rem;
        }

        .status-indicator {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .status-indicator.configured {
          background: #d4edda;
          color: #155724;
        }

        .status-indicator.not-configured {
          background: #fff3cd;
          color: #856404;
        }

        .config-details {
          margin-bottom: 1.5rem;
        }

        .config-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .config-status.ok {
          color: #28a745;
        }

        .config-status.missing {
          color: #dc3545;
        }

        .setup-instructions {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 4px solid #007bff;
        }

        .setup-instructions h4 {
          margin-top: 0;
          color: #007bff;
        }

        .setup-instructions ol {
          margin-bottom: 0;
        }

        .setup-instructions li {
          margin-bottom: 0.75rem;
        }

        .setup-instructions a {
          color: #007bff;
          text-decoration: none;
        }

        .setup-instructions a:hover {
          text-decoration: underline;
        }

        .setup-instructions pre {
          background: #e9ecef;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          overflow-x: auto;
          margin-top: 0.5rem;
        }

        .setup-instructions code {
          background: #e9ecef;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.85rem;
        }

        .info-section {
          background: #e7f3ff;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #17a2b8;
        }

        .info-section h4 {
          margin-top: 0;
          color: #17a2b8;
        }

        .info-section ul {
          margin-bottom: 0;
        }

        .info-section li {
          margin-bottom: 0.25rem;
        }

        @media (max-width: 768px) {
          .calendar-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }

          .setup-instructions pre {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};