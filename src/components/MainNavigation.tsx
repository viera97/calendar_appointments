import React from 'react';

/**
 * Main Navigation Component
 * 
 * Renders the primary navigation menu for switching between different
 * application views. Shows appointment count badge for user awareness
 * of scheduled appointments.
 */

// Props interface for the navigation component
interface MainNavigationProps {
  currentView: 'services' | 'booking' | 'appointments';    // Current active view
  onViewChange: (view: 'services' | 'appointments') => void; // View change callback
  appointmentCount: number;                                 // Number of scheduled appointments
}

const MainNavigation: React.FC<MainNavigationProps> = ({
  currentView,
  onViewChange,
  appointmentCount
}) => {
  return (
    <nav className="main-nav">
      {/* Services navigation button */}
      <button 
        className={currentView === 'services' ? 'active' : ''}
        onClick={() => onViewChange('services')}
      >
        Servicios
      </button>
      
      {/* Appointments navigation button with count badge */}
      <button 
        className={currentView === 'appointments' ? 'active' : ''}
        onClick={() => onViewChange('appointments')}
      >
        Mis Citas ({appointmentCount})
      </button>
    </nav>
  );
};

export default MainNavigation;