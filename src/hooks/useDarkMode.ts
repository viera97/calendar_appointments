import { useState, useEffect } from 'react';

/**
 * Custom Hook for Dark Mode Management
 * 
 * Handles dark mode state with localStorage persistence and automatic
 * CSS class application to the document element. Provides a simple
 * interface for toggling between light and dark themes.
 */
export const useDarkMode = () => {
  // Initialize dark mode state from localStorage or default to false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Effect to apply dark mode class and persist to localStorage
  useEffect(() => {
    // Apply or remove dark-mode class from document element
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
    // Persist preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  /**
   * Toggle between light and dark mode
   */
  const toggleDarkMode = () => {
    setIsDarkMode((prev: boolean) => !prev);
  };

  return {
    isDarkMode,
    toggleDarkMode
  };
};