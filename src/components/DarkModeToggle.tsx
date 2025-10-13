import React from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`dark-mode-toggle ${isDarkMode ? 'dark' : 'light'}`}
      title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
    >
      {isDarkMode ? <BsSun className="toggle-icon" /> : <BsMoon className="toggle-icon" />}
    </button>
  );
};

export default DarkModeToggle;