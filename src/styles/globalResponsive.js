/*
 * Global Responsive Utilities
 *
 * This file extends the responsiveStyles.js with additional responsive utilities
 * specifically designed for complex components like calendars and task cards.
 * It provides a centralized approach to responsive design across the application.
 */

import { useMediaQuery, useTheme } from '@mui/material';
import { breakpoints, mediaQueries } from './responsiveStyles';

/**
 * Hook that provides responsive styles specifically for calendar components
 * @returns {Object} Calendar-specific responsive style objects
 */
export const useCalendarResponsive = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(mediaQueries.mobile);
  const isTablet = useMediaQuery(mediaQueries.tablet);

  return {
    calendarContainer: {
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
      padding: isMobile ? theme.spacing(1) : theme.spacing(2),
    },
    calendarWrapper: {
      width: '100%',
      maxWidth: '100%',
      overflowX: 'auto',
      '& .MuiDateCalendar-root': {
        width: { xs: '100%', sm: 'auto' },
        maxWidth: '100%',
        '& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer': {
          justifyContent: 'space-around',
        },
      },
    },
    taskCardContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: { xs: 1, sm: 2 },
    },
  };
};

/**
 * Enhanced responsive grid layouts for different screen sizes
 */
export const responsiveGridLayouts = {
  // Single column on mobile, two columns on larger screens
  basic: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(4, 1fr)',
    },
    gap: { xs: 1.5, sm: 2, md: 3 },
  },
  // Calendar specific layout
  calendar: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      md: 'repeat(2, 1fr)',
    },
    gap: { xs: 2, sm: 3 },
  },
  // Task cards layout
  taskCards: {
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(auto-fill, minmax(280px, 1fr))',
      md: 'repeat(auto-fill, minmax(320px, 1fr))',
    },
    gap: { xs: 1.5, sm: 2 },
  },
};

/**
 * Responsive container styles that prevent content overflow
 */
export const safeContainerStyles = {
  width: '100%',
  maxWidth: '100%',
  overflowX: 'hidden',
  boxSizing: 'border-box',
  px: { xs: 1, sm: 2, md: 3 },
  py: { xs: 2, sm: 3, md: 4 },
};

/**
 * Responsive paper styles for consistent card appearance
 */
export const responsivePaperStyles = {
  p: { xs: 1.5, sm: 2, md: 3 },
  borderRadius: 2,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};