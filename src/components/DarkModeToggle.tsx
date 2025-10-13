import React from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';

/**
 * Props interface for the DarkModeToggle component
 */
interface DarkModeToggleProps {
  isDarkMode: boolean; // Current dark mode state
  onToggle: () => void; // Callback function to toggle dark mode
}

/**
 * DarkModeToggle Component
 * 
 * This component provides a floating toggle button to switch between light and dark modes.
 * It displays appropriate icons and tooltips based on the current mode.
 * 
 * Features:
 * - Floating button positioned fixed on screen
 * - Dynamic icons (sun for dark mode, moon for light mode)
 * - Accessibility support with ARIA labels
 * - Smooth transitions and hover effects
 * - Responsive design
 */
const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`dark-mode-toggle ${isDarkMode ? 'dark' : 'light'}`}
      title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
    >
      {/* Show sun icon in dark mode (to switch to light), moon icon in light mode (to switch to dark) */}
      {isDarkMode ? <BsSun className="toggle-icon" /> : <BsMoon className="toggle-icon" />}
    </button>
  );
};

export default DarkModeToggle;