import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getAppTheme } from '../theme';

// Create theme context
const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Get the saved theme from localStorage or default to light
  const getSavedTheme = () => {
    const savedTheme = localStorage.getItem('theme-mode');
    return savedTheme || 'light';
  };

  const [mode, setMode] = useState(getSavedTheme);
  const theme = getAppTheme(mode);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  // Update CSS variables for scrollbars based on theme
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--scrollbar-track',
      mode === 'dark' ? '#333' : '#f1f1f1'
    );
    document.documentElement.style.setProperty(
      '--scrollbar-thumb',
      mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
    );
  }, [mode]);

  const contextValue = {
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
