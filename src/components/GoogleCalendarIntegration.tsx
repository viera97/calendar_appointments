import React from 'react';
import { useGoogleCalendar } from '../hooks/useGoogleCalendar';

/**
 * Google Calendar Integration Component
 * 
 * Provides authentication controls and displays calendar sync status.
 * This component demonstrates how to use the useGoogleCalendar hook
 * for managing Google Calendar integration.
 */
export const GoogleCalendarIntegration: React.FC = () => {
  const {
    isAuthenticated,
    isInitialized,
    isLoading,
    error,
    events,
    authenticate,
    signOut,
    refreshEvents,
  } = useGoogleCalendar();

  // Show loading state during initialization
  if (!isInitialized) {
    return (
      <div className="google-calendar-integration">
        <div className="loading-state">
          <span>🔧 Inicializando Google Calendar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="google-calendar-integration">
      <div className="calendar-header">
        <h3>📅 Sincronización con Google Calendar</h3>
        <div className={`status-indicator ${isAuthenticated ? 'connected' : 'disconnected'}`}>
          {isAuthenticated ? '🟢 Conectado' : '🔴 Desconectado'}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>❌ Error: {error}</span>
        </div>
      )}

      <div className="calendar-actions">
        {!isAuthenticated ? (
          <button 
            onClick={authenticate}
            disabled={isLoading}
            className="auth-button primary"
          >
            {isLoading ? '⏳ Conectando...' : '🔗 Conectar con Google Calendar'}
          </button>
        ) : (
          <div className="authenticated-actions">
            <button 
              onClick={refreshEvents}
              disabled={isLoading}
              className="action-button secondary"
            >
              {isLoading ? '⏳ Cargando...' : '🔄 Actualizar Eventos'}
            </button>
            <button 
              onClick={signOut}
              className="action-button danger"
            >
              👋 Desconectar
            </button>
          </div>
        )}
      </div>

      {isAuthenticated && (
        <div className="calendar-events">
          <h4>📋 Próximos Eventos ({events.length})</h4>
          {events.length === 0 ? (
            <p className="no-events">No hay eventos próximos</p>
          ) : (
            <div className="events-list">
              {events.slice(0, 5).map((event, index) => (
                <div key={event.id || index} className="event-item">
                  <div className="event-title">{event.summary}</div>
                  <div className="event-time">
                    {event.start?.dateTime ? 
                      new Date(event.start.dateTime).toLocaleString('es-ES', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 
                      'Fecha no disponible'
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="integration-info">
        <p>
          ℹ️ Cuando crees nuevas citas, se sincronizarán automáticamente 
          con tu Google Calendar si estás conectado.
        </p>
      </div>

      <style>{`
        .google-calendar-integration {
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
          margin-bottom: 1rem;
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

        .status-indicator.connected {
          background: #d4edda;
          color: #155724;
        }

        .status-indicator.disconnected {
          background: #f8d7da;
          color: #721c24;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          border-left: 4px solid #dc3545;
        }

        .loading-state {
          text-align: center;
          padding: 2rem;
          color: var(--text-secondary);
        }

        .calendar-actions {
          margin-bottom: 1.5rem;
        }

        .authenticated-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .auth-button, .action-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .auth-button:disabled, .action-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-button.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .auth-button.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .action-button.secondary {
          background: var(--button-secondary);
          color: var(--text-color);
          border: 1px solid var(--border-color);
        }

        .action-button.secondary:hover:not(:disabled) {
          background: var(--button-secondary-hover);
        }

        .action-button.danger {
          background: #dc3545;
          color: white;
        }

        .action-button.danger:hover:not(:disabled) {
          background: #c82333;
        }

        .calendar-events h4 {
          color: var(--text-color);
          margin-bottom: 0.75rem;
          font-size: 1rem;
        }

        .no-events {
          color: var(--text-secondary);
          font-style: italic;
          text-align: center;
          padding: 1rem;
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .event-item {
          background: var(--background-color);
          padding: 0.75rem;
          border-radius: 6px;
          border-left: 3px solid var(--primary-color);
        }

        .event-title {
          font-weight: 500;
          color: var(--text-color);
          margin-bottom: 0.25rem;
        }

        .event-time {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .integration-info {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .integration-info p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .calendar-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }

          .authenticated-actions {
            flex-direction: column;
          }

          .auth-button, .action-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};