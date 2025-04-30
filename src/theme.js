import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Create a light theme with yellow and orange tones
const lightTheme = {
  palette: {
    mode: 'light',
    primary: {
      main: '#FF8A00', // Warm orange
      light: '#FFA84D', // Light orange
      dark: '#E67800', // Dark orange
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFBD00', // Golden yellow
      light: '#FFDD4D', // Light yellow
      dark: '#E6A800', // Dark yellow
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF', // Pure white
      paper: '#FFFFFF',
      card: '#FFFFFF',
      subtle: '#FFF9EE', // Very light cream
    },
    text: {
      primary: '#333333', // Dark gray
      secondary: '#666666', // Medium gray
      disabled: '#999999', // Light gray
    },
    divider: 'rgba(255, 138, 0, 0.12)', // Orange-tinted divider
    action: {
      active: '#FF8A00',
      hover: 'rgba(255, 138, 0, 0.08)',
      selected: 'rgba(255, 138, 0, 0.16)',
      disabled: 'rgba(0, 0, 0, 0.3)',
      disabledBackground: 'rgba(0, 0, 0, 0.08)',
    },
  },
};

// Create a dark theme with yellow and orange tones
const darkTheme = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFA84D', // Brighter orange for dark mode
      light: '#FFBD6B',
      dark: '#E67800',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFDD4D', // Brighter yellow for dark mode
      light: '#FFEB80',
      dark: '#E6A800',
      contrastText: '#333333', // Dark text for contrast on bright yellow
    },
    background: {
      default: '#111111', // Almost black
      paper: '#1E1E1E',
      card: '#252525',
      subtle: '#333333',
    },
    text: {
      primary: '#FFFFFF', // White for contrast
      secondary: '#EEEEEE', // Light gray
      disabled: '#AAAAAA', // Medium gray
    },
    divider: 'rgba(255, 138, 0, 0.24)', // More visible orange divider
    action: {
      active: '#FFA84D', // Ensure active elements are clearly visible
      hover: 'rgba(255, 168, 77, 0.16)',
      selected: 'rgba(255, 168, 77, 0.24)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
};

// Common theme settings for both light and dark
const commonThemeSettings = {
  typography: {
    fontFamily: '"Nunito", "Roboto", sans-serif',
    logoText: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      '@media (min-width:600px)': {
        fontSize: '3rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      '@media (min-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (min-width:600px)': {
        fontSize: '1.4rem',
      },
    },
    h5: {
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.57,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.5,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
  },
  shape: {
    borderRadius: 12, // Slightly more rounded corners
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(255, 138, 0, 0.05)',
    '0 1px 4px 0 rgba(255, 138, 0, 0.08)',
    '0 1px 8px 0 rgba(255, 138, 0, 0.08)',
    '0 2px 16px -1px rgba(255, 138, 0, 0.08)',
    '0 3px 5px -1px rgba(255, 138, 0, 0.08), 0 3px 4px -1px rgba(255, 138, 0, 0.04)',
    '0 3px 5px -1px rgba(255, 138, 0, 0.1), 0 5px 8px -1px rgba(255, 138, 0, 0.08)',
    '0 4px 5px -2px rgba(255, 138, 0, 0.1), 0 7px 10px -2px rgba(255, 138, 0, 0.06)',
    '0 5px 6px -3px rgba(255, 138, 0, 0.1), 0 9px 12px -3px rgba(255, 138, 0, 0.06)',
    '0 6px 6px -3px rgba(255, 138, 0, 0.1), 0 11px 12px -3px rgba(255, 138, 0, 0.06)',
    '0 6px 7px -4px rgba(255, 138, 0, 0.1), 0 11px 15px -4px rgba(255, 138, 0, 0.08)',
    '0 7px 8px -4px rgba(255, 138, 0, 0.1), 0 13px 19px -4px rgba(255, 138, 0, 0.08)',
    '0 8px 9px -5px rgba(255, 138, 0, 0.1), 0 15px 22px -5px rgba(255, 138, 0, 0.08)',
    '0 8px 10px -5px rgba(255, 138, 0, 0.1), 0 16px 24px -5px rgba(255, 138, 0, 0.08)',
    '0 8px 12px -6px rgba(255, 138, 0, 0.1), 0 18px 28px -6px rgba(255, 138, 0, 0.08)',
    '0 9px 12px -6px rgba(255, 138, 0, 0.1), 0 19px 29px -6px rgba(255, 138, 0, 0.08)',
    '0 10px 14px -6px rgba(255, 138, 0, 0.12), 0 22px 35px -6px rgba(255, 138, 0, 0.1)',
    '0 11px 15px -7px rgba(255, 138, 0, 0.12), 0 24px 38px -7px rgba(255, 138, 0, 0.1)',
    '0 12px 17px -8px rgba(255, 138, 0, 0.14), 0 24px 38px -8px rgba(255, 138, 0, 0.11)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'var(--scrollbar-track, #f1f1f1)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--scrollbar-thumb, rgba(255, 138, 0, 0.3))',
            borderRadius: '20px',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: 24,
          paddingBottom: 24,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 10px 0 rgba(255, 138, 0, 0.2)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 12px 0 rgba(255, 138, 0, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px 0 rgba(255, 138, 0, 0.08)',
          overflow: 'hidden',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            boxShadow: '0 8px 20px 0 rgba(255, 138, 0, 0.15)',
            transform: 'translateY(-3px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 1px 4px 0 rgba(255, 138, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 2px 8px 0 rgba(255, 138, 0, 0.12)',
        },
        elevation3: {
          boxShadow: '0 3px 12px 0 rgba(255, 138, 0, 0.15)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: '1em',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px 0 rgba(255, 138, 0, 0.1)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 138, 0, 0.12)',
        },
      },
    },
  },
};

// Function to get the theme based on mode
export const getAppTheme = (mode) => {
  const themeOptions = mode === 'dark' ? darkTheme : lightTheme;

  const theme = createTheme({
    ...themeOptions,
    ...commonThemeSettings,
  });

  return responsiveFontSizes(theme);
};

// Default theme with light mode
let theme = getAppTheme('light');

export default theme;
